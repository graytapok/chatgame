from typing import Optional

from pydantic import BaseModel


class ApiException(Exception):
    def __init__(self, status: int, message: str, details: Optional[str | BaseModel] = None):
        self.status = status
        self.message = message

        if isinstance(details, BaseModel):
            self.details = details.model_dump(mode="json", exclude_none=True)
        else:
            self.details = details
