from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from chatgame.extensions import db


class OwnedItemModel(db.Model):
    __tablename__ = "owned_item"

    user_id: Mapped[int] = mapped_column(ForeignKey("balance.user_id"), primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("item.id"), primary_key=True)