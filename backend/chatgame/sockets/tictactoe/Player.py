from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class Player(BaseModel):
    sid: str
    room: str | None = None
    username: str
    user_id: UUID | None = None
    opponent_id: str | None
    symbol: Literal["X", "O"] = "X"