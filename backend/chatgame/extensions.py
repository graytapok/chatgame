from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer
from flask_mongoengine import MongoEngine
from flask_marshmallow import Marshmallow
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_session import Session
from flask_restx import Api
from flask_mail import Mail

from chatgame.config import Config

__all__ = ["db", "ma", "sess", "login", "api", "mail", "safe", "safe_t", "socketio"]

socketio = SocketIO(cors_allowed_origins="*", manage_session=False, logger=False)
safe_t = URLSafeTimedSerializer(Config.SECRET_KEY)
safe = URLSafeSerializer(Config.SECRET_KEY)
login = LoginManager()
ma = Marshmallow()
db = MongoEngine()
sess = Session()
mail = Mail()
api = Api(
    title="Chatgame - Api",
    prefix="/api",
    description="Backend for chatgame",
    doc="/api/doc",
)
