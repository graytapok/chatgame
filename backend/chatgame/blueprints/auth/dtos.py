from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class LoginBody(BaseModel):
    login: str
    password: str
    remember: bool = True

class RegisterBody(BaseModel):
    username: str = Field(min_length=3)
    email: EmailStr
    password: str = Field(min_length=8)

class RegisterQuery(BaseModel):
    email: Optional[bool] = Field(default=True)

class ConfirmEmailQuery(BaseModel):
    token: str = Field(alias="t")

class ResendEmailBody(BaseModel):
    login: str

class ChangePasswordBody(BaseModel):
    password: str = Field(min_length=8)

class ChangePasswordQuery(BaseModel):
    token: str = Field(alias="t")