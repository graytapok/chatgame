from itsdangerous import URLSafeTimedSerializer
from flask_mongoengine import MongoEngine
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_mail import Mail

from chatgame.config import Config

socketio = SocketIO(cors_allowed_origins="*", manage_session=False, logger=False)
safe = URLSafeTimedSerializer(Config.SECRET_KEY)
login = LoginManager()
db = MongoEngine()
mail = Mail()
