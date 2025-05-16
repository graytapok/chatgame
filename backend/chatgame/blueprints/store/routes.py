from flask_login import login_required, current_user
from flask_pydantic import validate

from chatgame.db.dto import BalanceDto, ItemDto, PaymentDto
from .dto import ProductDto, CreateCheckoutSessionBody
from .StoreService import StoreService
from ..store import bp


@bp.post("/payments/checkout_session")
@login_required
@validate()
def create_checkout_session(body: CreateCheckoutSessionBody):
    return StoreService.create_checkout_session(
        current_user.id,
        body.price_id,
        body.success_url,
        body.cancel_url,
        body.payment_hash_alias
    )

@bp.post("/payments/webhook")
def stripe_webhook():
    # stripe listen --forward-to localhost:5000/api/store/payments/webhook <- to start webhook

    StoreService.stripe_webhook()

    return {}, 204

@bp.get("/payments/<payment_hash>")
@login_required
@validate()
def get_payment(payment_hash: str):
    payment = StoreService.get_payment_by_hash_or_throw(payment_hash)

    return PaymentDto.model_validate(payment, from_attributes=True)

@bp.delete("/payments/<payment_hash>")
@login_required
@validate()
def delete_payment(payment_hash: str):
    StoreService.delete_payment(current_user.id, payment_hash)

    return {}, 204

@bp.get("/products")
@login_required
@validate(response_many=True)
def get_products():
    products = StoreService.get_products()

    return [ProductDto.model_validate(i) for i in products]

@bp.get("/balance")
@login_required
@validate()
def get_balance():
    balance = StoreService.get_balance(current_user.id)

    return BalanceDto(
        user_id=balance.user_id,
        chagcoins=balance.chagcoins,
        items=[ItemDto.model_validate(i) for i in balance.items]
    )