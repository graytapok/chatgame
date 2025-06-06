from typing import Optional

from pydantic import BaseModel


class InviteBody(BaseModel):
    receiver_id: Optional[str]