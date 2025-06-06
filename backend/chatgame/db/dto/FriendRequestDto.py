from datetime import datetime

from pydantic import BaseModel, ConfigDict

from chatgame.constants import RequestStatus
from chatgame.db.dto import UserDto


class FriendRequestDto(BaseModel):
    id: int
    status: RequestStatus

    sender: UserDto
    receiver: UserDto

    send_at: datetime
    expires_at: datetime

    model_config = ConfigDict(from_attributes=True)