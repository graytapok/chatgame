from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, Table, Column, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from chatgame.db import Base
from chatgame.extensions import db


class FriendModel(db.Model):
    __tablename__ = "friend"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    friend_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)

    since: Mapped[datetime] = mapped_column(default=datetime.now)


friend_table = Table(
    "friend",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("friend_id", ForeignKey("user.id"), primary_key=True),
    Column("since", DateTime(), default=datetime.now),
    extend_existing=True
)