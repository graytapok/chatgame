from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator

from chatgame.dto import SubStatisticsDto


class TotalStatisticsDto(BaseModel):
    id: int
    user_id: UUID

    total_games: int
    total_wins: int
    total_draws: int
    total_losses: int

    sub_statistics: List[SubStatisticsDto] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)