from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chatgame.extensions import db
from chatgame.models import SubStatisticsModel


class TotalStatisticsModel(db.Model):
    __tablename__ = "total_statistics"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), unique=True)

    total_games: Mapped[int] = mapped_column(default=0, nullable=False)
    total_wins: Mapped[int] = mapped_column(default=0, nullable=False)
    total_draws: Mapped[int] = mapped_column(default=0, nullable=False)
    total_losses: Mapped[int] = mapped_column(default=0, nullable=False)

    user: Mapped["UserModel"] = relationship(back_populates="statistics")
    sub_statistics: Mapped[List["SubStatisticsModel"]] = relationship(back_populates="total_statistics", cascade="all, delete")

    def __init__(self, user_id: UUID):
        self.user_id = user_id
