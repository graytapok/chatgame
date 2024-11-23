from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

from .SubStatisticsModel import SubStatisticsModel
from .TotalStatisticsModel import TotalStatisticsModel
from .UserModel import UserModel
