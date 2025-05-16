from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PaymentDto(BaseModel):
    id: int
    user_id: UUID
    fulfilled: bool
    created_at: datetime

    total_amount: int | None
    expires_at: datetime | None
    receipt_url: str | None
    payment_method: str | None
    billing_email: str | None
    full_name: str | None
    country: str | None

