from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from chatgame.extensions import db

class ItemModel(db.Model):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    description: Mapped[str] = mapped_column(nullable=False)

    price: Mapped[int] = mapped_column(nullable=False)

    images: Mapped[JSON] = mapped_column(nullable=False, type_=JSON)