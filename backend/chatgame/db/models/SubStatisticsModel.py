from sqlalchemy import ForeignKey, Enum, case
from sqlalchemy.ext.hybrid import hybrid_property
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
    elo: Mapped[int] = mapped_column(default=0, nullable=False)

    @hybrid_property
    def win_percentage(self) -> float:
        return self.wins / self.games if self.games > 0 else 0

    @win_percentage.expression
    def win_percentage(cls):
        return case(
            (cls.games > 0, cls.wins / cls.games),
            else_=0
        )

    total_statistics: Mapped["TotalStatisticsModel"] = relationship(back_populates="sub_statistics")

    def __init__(self, game_name: Game, total_statistics_id: int):
        self.game_name = game_name
        self.total_statistics_id = total_statistics_id
