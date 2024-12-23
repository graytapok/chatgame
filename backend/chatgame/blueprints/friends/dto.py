from typing import Literal

from pydantic import BaseModel


class AnswerFriendRequestBody(BaseModel):
    answer: Literal["accept", "reject"]