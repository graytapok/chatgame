from typing import Optional

from pydantic import BaseModel


class UserValidationErrorDetails(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None