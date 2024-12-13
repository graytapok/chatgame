from typing import List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from chatgame.db.dto import SubStatisticsDto


class TotalStatisticsDto(BaseModel):
    id: int
    user_id: UUID

    total_games: int
    total_wins: int
    total_draws: int
    total_losses: int

    win_percentage: float

    sub_statistics: List[SubStatisticsDto] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)