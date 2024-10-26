from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserRead(BaseModel):
    id: str
    username: str
    email: EmailStr
    admin: bool
    email_confirmed: bool

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str