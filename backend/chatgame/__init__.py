from flask import Flask
from flask_cors import CORS
from flask_login import FlaskLoginClient
from werkzeug.middleware.proxy_fix import ProxyFix
from typing import Literal

from chatgame.config import Config, TestConfig, ProductionConfig
from chatgame.db import models
from chatgame.extensions import *

from icecream import install, ic

ic.configureOutput(includeContext=True)
install()

def create_app(mode: Literal["dev", "prod", "test"] = "dev"):
    app = Flask(__name__)

    match mode:
        case "test":
            config_class = TestConfig
        case "prod":
            config_class = ProductionConfig
        case _:
            config_class = Config

    app.config.from_object(config_class)
    app.test_client_class = FlaskLoginClient
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    CORS(app)
    
    # Extensions
    db.init_app(app)

    with app.app_context():
        app.config["SESSION_MONGODB"] = db.connection["default"]

    mail.init_app(app)
    login.init_app(app)
    socketio.init_app(app)
    
    # Routing
    from . import api, handlers

    app.register_blueprint(api.bp)
    app.register_blueprint(handlers.bp)

    # Sockets
    with app.app_context():
        from chatgame.sockets import tictactoe_plus, chat, tictactoe

        socketio.on_namespace(chat.Socket(namespace="/chat"))
        socketio.on_namespace(tictactoe.Socket(namespace="/tictactoe"))
        socketio.on_namespace(tictactoe_plus.Socket(namespace="/tictactoe_plus"))
        
    app.add_url_rule('/favicon.ico', 'favicon', lambda: app.send_static_file('favicon.ico'))

    return app
