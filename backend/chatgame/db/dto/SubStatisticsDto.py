from pydantic import BaseModel, ConfigDict

from chatgame.constants import Game


class SubStatisticsDto(BaseModel):
    id: int
    game_name: Game
    total_statistics_id: int

    games: int
    wins: int
    draws: int
    losses: int
    elo: int

    win_percentage: float

    model_config = ConfigDict(from_attributes=True)