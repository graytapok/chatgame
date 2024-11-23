from flask import Flask
from typing import Literal

from flask_cors import CORS
from flask_login import FlaskLoginClient
from werkzeug.middleware.proxy_fix import ProxyFix

from chatgame import models
from chatgame.sockets import register_sockets
from chatgame.extensions import init_extensions, socketio
from chatgame.blueprints import register_blueprints

def create_app(config_class: Literal["DevelopmentConfig", "ProductionConfig", "TestConfig"] = "DevelopmentConfig"):
    app = Flask(__name__)

    app.config.from_object(f"chatgame.config.{config_class}")
    app.test_client_class = FlaskLoginClient
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    CORS(app)

    init_extensions(app)

    register_blueprints(app)

    register_sockets(socketio)

    return app
