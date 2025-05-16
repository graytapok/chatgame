import stripe

from flask import Flask
from flask_mail import Mail
from flask_login import LoginManager
from itsdangerous import URLSafeTimedSerializer
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_apscheduler import APScheduler

from chatgame.config import config
from chatgame.db import Base

db = SQLAlchemy(model_class=Base)
mail = Mail()
safe = URLSafeTimedSerializer(config.ITSDANGEROUS_SECRET_KEY)
login = LoginManager()
migrate = Migrate()
socketio = SocketIO(cors_allowed_origins="*", manage_session=False, logger=False)
scheduler = APScheduler()

def init_extensions(app: Flask):
    db.init_app(app)
    mail.init_app(app)
    login.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    scheduler.init_app(app)

    stripe.api_key = config.STRIPE_SECRET_KEY
