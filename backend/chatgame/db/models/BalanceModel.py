from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from chatgame.extensions import db


class BalanceModel(db.Model):
    __tablename__ = "balance"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)

    chagcoins: Mapped[int] = mapped_column(nullable=False, default=0)

    items: Mapped[list["ItemModel"]] = relationship(
        secondary="owned_item",
        cascade="all, delete"
    )

    payments: Mapped[list["PaymentModel"]] = relationship(cascade="all, delete")

    user: Mapped["UserModel"] = relationship(back_populates="balance")

    @validates("chagcoins")
    def validate_chagcoins(self, _key, value):
        if value < 0:
            ValueError("Chagcoin balance should be positive or zero.")

        return value

    def __init__(self, user_id: UUID):
        self.user_id = user_id