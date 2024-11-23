from typing import Literal

from pydantic import BaseModel


class Player(BaseModel):
    sid: str
    room: str | None = None
    username: str
    opponent_id: str | None
    symbol: Literal["X", "O"] = "X"