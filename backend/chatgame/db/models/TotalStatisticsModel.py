from typing import List
from uuid import UUID

from sqlalchemy import ForeignKey, case
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.hybrid import hybrid_property

from chatgame.extensions import db
from chatgame.db.models import SubStatisticsModel

class TotalStatisticsModel(db.Model):
    __tablename__ = "total_statistics"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), unique=True)

    # handled by triggers
    total_games: Mapped[int] = mapped_column(default=0, nullable=False)
    total_wins: Mapped[int] = mapped_column(default=0, nullable=False)
    total_draws: Mapped[int] = mapped_column(default=0, nullable=False)
    total_losses: Mapped[int] = mapped_column(default=0, nullable=False)
    total_elo: Mapped[int] = mapped_column(default=0, nullable=False)

    @hybrid_property
    def win_percentage(self) -> float:
        return self.total_wins / self.total_games if self.total_games > 0 else 0

    @win_percentage.expression
    def win_percentage(cls):
        return case(
            (cls.total_games > 0, cls.total_wins / cls.total_games),
            else_=0
        )

    user: Mapped["UserModel"] = relationship(back_populates="statistics")
    sub_statistics: Mapped[List["SubStatisticsModel"]] = relationship(
        back_populates="total_statistics",
        cascade="all, delete"
    )

    def __init__(self, user_id: UUID):
        self.user_id = user_id