from datetime import datetime
from uuid import UUID

from flask import request, current_app
from stripe import Webhook, SignatureVerificationError, Product, Price, PaymentIntent, Charge, PaymentMethod
from stripe.checkout import Session

from chatgame.blueprints.auth.exceptions import ForbiddenException
from chatgame.blueprints.store.exceptions import FulfilledException
from chatgame.config import config
from chatgame.db.models import BalanceModel, PaymentModel
from chatgame.exceptions import BadRequestException, NotFoundException
from chatgame.extensions import db, safe


class StoreService:
    @staticmethod
    def create_checkout_session(user_id: UUID, price_id: str, success_url: str, cancel_url: str, payment_hash_alias: str):
        try:
            balance = StoreService.get_balance(user_id)

            payment = PaymentModel(balance, price_id)

            db.session.add(payment)
            db.session.commit()

            payment_hash = safe.dumps(payment.id, salt="payment_id")

            checkout_session = Session.create(
                payment_method_types=["card", "paypal"],
                mode="payment",
                success_url=success_url + f"?{payment_hash_alias}={payment_hash}",
                cancel_url=cancel_url + f"?{payment_hash_alias}={payment_hash}",
                line_items=[{"price": price_id, "quantity": 1}],
                metadata={"payment": payment_hash}
            )

            payment.expires_at = datetime.fromtimestamp(checkout_session.expires_at)
            payment.total_amount = checkout_session.amount_total

            db.session.commit()

            return {"url": checkout_session.url}

        except Exception:
            raise ForbiddenException

    @staticmethod
    def stripe_webhook():
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get("Stripe-Signature")

        try:
            event = Webhook.construct_event(payload, sig_header, config.STRIPE_WEBHOOK_KEY)

        except ValueError:
            raise BadRequestException("Invalid payload.")

        except SignatureVerificationError:
            raise BadRequestException("Invalid signature.")

        data = event.data["object"]

        match event.type:
            case "checkout.session.completed":
                payment = StoreService.get_payment_by_hash_or_throw(data["metadata"]["payment"])

                payment_intent = PaymentIntent.retrieve(data["payment_intent"])

                charge = Charge.retrieve(payment_intent.latest_charge)

                payment_method = PaymentMethod.retrieve(payment_intent.payment_method)

                payment.billing_email = data["customer_details"]["email"]
                payment.country = data["customer_details"]["address"]["country"]
                payment.full_name = data["customer_details"]["name"]
                payment.payment_method = payment_method.type
                payment.receipt_url = charge.receipt_url
                payment.expires_at = None
                payment.fulfilled = True

                balance = StoreService.get_balance(payment.user_id)

                if payment.price_id == config.CHAGCOINS_1000_PRICE_ID:
                    balance.chagcoins += 1000
                elif payment.price_id == config.CHAGCOINS_2500_PRICE_ID:
                    balance.chagcoins += 2500
                elif payment.price_id == config.CHAGCOINS_6000_PRICE_ID:
                    balance.chagcoins += 6000
                elif payment.price_id == config.CHAGCOINS_13000_PRICE_ID:
                    balance.chagcoins += 13000
                else:
                    current_app.logger.error(f"Price id '{payment.price_id}' not found.")

                db.session.add(payment)
                db.session.commit()

            case "checkout.session.expired":  # works only if the webhook is always listening
                payment = StoreService.get_payment_or_throw(data["metadata"]["payment_id"])

                db.session.delete(payment)
                db.session.commit()

    @staticmethod
    def get_products():
        products = Product.list()

        if not products:
            raise NotFoundException("Products", None)

        for i in products:
            price = Price.retrieve(i.default_price)
            i.currency = price.currency
            i.price = price.unit_amount

        return products

    @staticmethod
    def get_balance(user_id: UUID):
        balance = (
            db.session.query(BalanceModel)
            .where(BalanceModel.user_id == user_id)
            .first()
        )

        if balance is None:
            balance = BalanceModel(user_id)

            db.session.add(balance)
            db.session.commit()

        return balance

    @staticmethod
    def get_payment_or_throw(payment_id: int):
        payment = db.session.query(PaymentModel).where(PaymentModel.id == payment_id).first()

        if payment is None:
            raise NotFoundException("Payment", payment_id)

        return payment

    @staticmethod
    def get_payment_by_hash_or_throw(payment_hash: str):
        try:
            payment_id = safe.loads(payment_hash, salt="payment_id", max_age=60*60)

            return StoreService.get_payment_or_throw(payment_id)

        except Exception:
            raise NotFoundException("Payment")

    @staticmethod
    def delete_payment(user_id: UUID, payment_hash: str):
        payment = StoreService.get_payment_by_hash_or_throw(payment_hash)

        if payment.user_id != payment.user_id:
            raise ForbiddenException

        if payment.fulfilled:
            raise FulfilledException

        db.session.delete(payment)
        db.session.commit()