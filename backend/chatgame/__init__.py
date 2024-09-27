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

    from chatgame.namespaces import auth, errors

    app.register_blueprint(errors.bp)

    api.add_namespace(errors.ns)
    api.add_namespace(auth.ns, path="/auth")

    with app.app_context():
        from chatgame.sockets import tictactoe_plus, chat, tictactoe

        socketio.on_namespace(chat.Socket(namespace="/chat"))
        socketio.on_namespace(tictactoe.Socket(namespace="/tictactoe"))
        socketio.on_namespace(tictactoe_plus.Socket(namespace="/tictactoe_plus"))

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(
            os.path.join(app.root_path, 'static'),
            'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )

    return app
