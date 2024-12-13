from flask_login import UserMixin
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.exc import DataError
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from chatgame.db import Base
from chatgame.extensions import db, login
from chatgame.db.models import TotalStatisticsModel

friends_table = Table(
    "friends",
    Base.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("friend_id", ForeignKey("user.id"), primary_key=True)
)

class UserModel(UserMixin, db.Model):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4())
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    password_hash: Mapped[str]

    admin: Mapped[bool] = mapped_column(default=False)
    email_confirmed: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())

    verification_token: Mapped[str] = mapped_column(nullable=True)
    password_token: Mapped[str] = mapped_column(nullable=True)

    statistics: Mapped["TotalStatisticsModel"] = relationship(back_populates="user", cascade="all, delete")
    friends: Mapped[list["UserModel"]] = relationship(
        back_populates="friends",
        secondary=friends_table,
        primaryjoin=id == friends_table.c.user_id,
        secondaryjoin=id == friends_table.c.friend_id,
        cascade="all, delete"
    )

    def __init__(
            self,
            username: str,
            email: str,
            password_to_hash: str,
            admin: bool = False,
            email_confirmed: bool = False
    ):
        self.username = username
        self.email = email
        self.admin = admin
        self.email_confirmed = email_confirmed

        self.set_password(password_to_hash)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        return self.password_hash

    def check_password(self, password):
        return check_password_hash(str(self.password_hash), password)


@login.user_loader
def load_user(user_id):
    try:
        return UserModel.query.get(user_id)
    except DataError:
        return None