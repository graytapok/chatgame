from uuid import UUID

from pydantic import BaseModel, ConfigDict

from chatgame.db.dto import ItemDto

class BalanceDto(BaseModel):
    user_id: UUID
    chagcoins: int
    items: list[ItemDto]

    model_config = ConfigDict(from_attributes=True)