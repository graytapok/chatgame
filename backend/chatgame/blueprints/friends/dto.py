from typing import Literal
from datetime import datetime
from pydantic import BaseModel, field_validator

from chatgame.db.dto import UserDto


class FriendUserDto(UserDto):
    online: bool | None
    last_seen: datetime | None

    @field_validator("online", mode="before")
    @classmethod
    def set_false_if_none(cls, value):
        return False if value is None else value

class AnswerFriendRequestBody(BaseModel):
    answer: Literal["accept", "reject"]