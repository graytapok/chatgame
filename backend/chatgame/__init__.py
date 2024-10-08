from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_login import FlaskLoginClient

from werkzeug.middleware.proxy_fix import ProxyFix

from chatgame.config import Config, TestConfig
from chatgame.extensions import *
from chatgame.database import *

from icecream import install, ic
import os

__all__ = [
    "create_app",
    "Config"
]

ic.configureOutput(includeContext=True)
install()

def create_app(test: bool = False):
    ConfigClass = TestConfig if test else Config

    app = Flask(__name__)

    app.config.from_object(ConfigClass)
    app.test_client_class = FlaskLoginClient
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    CORS(app)

    db.init_app(app)

    with app.app_context():
        app.config["SESSION_MONGODB"] = db.connection["default"]

    ma.init_app(app)
    api.init_app(app)
    sess.init_app(app)
    mail.init_app(app)
    login.init_app(app)
    socketio.init_app(app)

    from chatgame import namespaces, sockets

    app.register_blueprint(namespaces.errors_bp)

    api.add_namespace(namespaces.errors_ns)
    api.add_namespace(namespaces.auth_ns, path="/auth")

    with app.app_context():
        socketio.on_namespace(sockets.ChatSocket(namespace="/chat"))
        socketio.on_namespace(sockets.TictactoeSocket(namespace="/tictactoe"))
        socketio.on_namespace(sockets.TictactoePlusSocket(namespace="/tictactoe_plus"))

    @app.shell_context_processor
    def shell():
        return {"db": db, "models": models}

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(
            os.path.join(app.root_path, 'static'),
            'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )

    return app
