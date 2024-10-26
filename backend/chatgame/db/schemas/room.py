from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

from chatgame.db.schemas.user import UserRead

class RoomRead(BaseModel):
    id: str
    type: str
    capacity: int
    created_at: datetime
    
    users: UserRead
    
    model_config = ConfigDict(from_attributes=True)
    
class RoomCreate(BaseModel):
    type: str
    capacity: int = Field(gt=0)