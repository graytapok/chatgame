from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ApiExceptionDto(BaseModel):
    timestamp: str = datetime.now().isoformat()
    status: int
    message: str
    path: str
    details: Optional[dict | str] = None