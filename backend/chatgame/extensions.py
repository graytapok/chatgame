from itsdangerous import URLSafeTimedSerializer
from flask_mongoengine import MongoEngine
from flask_marshmallow import Marshmallow
from flask_login import LoginManager
from flask_session import Session
from flask_restx import Api
from flask_mail import Mail

from chatgame import Config

__all__ = (
    "db", "ma", "sess", "login", "api", "mail", "safe",
)

safe = URLSafeTimedSerializer(Config.SECRET_KEY)
api = Api(
    title="Chatgame - Api",
    prefix="/api",
    description="Backend for chatgame",
    doc="/api/doc",
)
login = LoginManager()
db = MongoEngine()
ma = Marshmallow()
sess = Session()
mail = Mail()
