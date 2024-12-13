from flask import Flask
from flask_mail import Mail
from flask_login import LoginManager
from itsdangerous import URLSafeTimedSerializer
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from chatgame.config import Config
from chatgame.db import Base

socketio = SocketIO(cors_allowed_origins="*", manage_session=False, logger=False)
safe = URLSafeTimedSerializer(Config.ITSDANGEROUS_SECRET_KEY)
db = SQLAlchemy(model_class=Base)
login = LoginManager()
migrate = Migrate()
mail = Mail()

def init_extensions(app: Flask):
    db.init_app(app)
    mail.init_app(app)
    login.init_app(app)
    socketio.init_app(app)
    migrate.init_app(app, db)