from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID

class UserDto(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    admin: bool
    email_confirmed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)