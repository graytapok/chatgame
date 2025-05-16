from pydantic import BaseModel, Field, ConfigDict


class CreateCheckoutSessionBody(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    payment_hash_alias: str

class ProductDto(BaseModel):
    id: str
    name: str
    description: str | None
    price: int
    currency: str
    price_id: str = Field(alias="default_price")
    images: list[str]
    created_at: int = Field(alias="created")
    type: str

    model_config = ConfigDict(from_attributes=True)