from flask import Flask

from flask_cors import CORS
from flask_login import FlaskLoginClient

from chatgame import db
from chatgame.config import ConfigClasses
from chatgame.sockets import register_sockets
from chatgame.extensions import init_extensions, socketio
from chatgame.blueprints import register_blueprints

def create_app(config_class: ConfigClasses = "DevelopmentConfig"):
    app = Flask(__name__)

    app.config.from_object(f"chatgame.config.{config_class}")
    app.test_client_class = FlaskLoginClient

    CORS(app)

    init_extensions(app)

    register_blueprints(app)

    register_sockets(socketio)

    return app
