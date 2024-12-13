from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

from . import models, dto

