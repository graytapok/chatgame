from sqlalchemy import ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from chatgame.constants import Game
from chatgame.extensions import db


class SubStatisticsModel(db.Model):
    __tablename__ = "sub_statistics"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_name: Mapped[Game] = mapped_column(Enum(Game), nullable=False)
    total_statistics_id: Mapped[int] = mapped_column(ForeignKey("total_statistics.id"))

    games: Mapped[int] = mapped_column(default=0, nullable=False)
    wins: Mapped[int] = mapped_column(default=0, nullable=False)
    draws: Mapped[int] = mapped_column(default=0, nullable=False)
    losses: Mapped[int] = mapped_column(default=0, nullable=False)

    total_statistics: Mapped["TotalStatisticsModel"] = relationship(back_populates="sub_statistics")

    def __init__(self, game_name: Game, total_statistics_id: int):
        self.game_name = game_name
        self.total_statistics_id = total_statistics_id
