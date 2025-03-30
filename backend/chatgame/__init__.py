from flask import Flask

from flask_cors import CORS
from flask_login import FlaskLoginClient

from chatgame import db as db
from chatgame.config import config as app_config, Environments
from chatgame.sockets import register_sockets
from chatgame.extensions import init_extensions, socketio, scheduler
from chatgame.blueprints import register_blueprints

def create_app(environment: Environments = "dev"):
    app = Flask(__name__)

    app_config.ENV = environment

    app.config.from_object(app_config)
    app.test_client_class = FlaskLoginClient

    CORS(app)

    init_extensions(app)

    register_blueprints(app)

    register_sockets(socketio)

    scheduler.start()

    return app
