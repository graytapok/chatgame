from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from chatgame.db.models import BalanceModel
from chatgame.extensions import db


class PaymentModel(db.Model):
    __tablename__ = "payment"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("balance.user_id"))
    fulfilled: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    price_id: Mapped[str]

    total_amount: Mapped[int] = mapped_column(nullable=True)
    expires_at: Mapped[datetime] = mapped_column(nullable=True)
    receipt_url: Mapped[str] = mapped_column(unique=True, nullable=True)
    payment_method: Mapped[str] = mapped_column(nullable=True)
    billing_email: Mapped[str] = mapped_column(nullable=True)
    full_name: Mapped[str] = mapped_column(nullable=True)
    country: Mapped[str] = mapped_column(nullable=True)

    balance: Mapped["BalanceModel"] = relationship(back_populates="payments")

    def __init__(self, balance: BalanceModel, price_id: str):
        self.balance = balance
        self.price_id = price_id
