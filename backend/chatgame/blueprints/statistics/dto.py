from typing import List

from pydantic import BaseModel, Field

from chatgame.db.dto import TotalStatisticsDto, UserDto


class LeaderboardUserDto(UserDto):
    rank: int | None = None
    statistics: TotalStatisticsDto

class LeaderboardQuery(BaseModel):
    p: int = 1
    per: int = 25

class LeaderboardDto(BaseModel):
    total: int
    pages: int
    current_page: int
    next_page: int | None
    prev_page: int | None
    users: List[LeaderboardUserDto]
    top3: List[LeaderboardUserDto]