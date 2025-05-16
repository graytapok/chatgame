from pydantic import BaseModel, ConfigDict


class ItemDto(BaseModel):
    id: int
    name: str
    description: str
    price: int
    images: dict[str, str]

    model_config = ConfigDict(from_attributes=True)