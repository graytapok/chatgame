from flask import Flask
from flask_cors import CORS

from werkzeug.middleware.proxy_fix import ProxyFix

from .config import Config
from .extensions import *
from .database import *

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    CORS(app)

    db.init_app(app)
    ma.init_app(app)
    api.init_app(app)
    mail.init_app(app)
    login.init_app(app)

    with app.app_context():
        app.config["SESSION_MONGODB"] = db.connection["default"]

    sess.init_app(app)

    from . import namespaces

    app.register_blueprint(namespaces.errors_bp)

    api.add_namespace(namespaces.errors_ns)
    api.add_namespace(namespaces.auth_ns, path="/auth")

    @app.shell_context_processor
    def shell():
        return {"db": db, "models": models}
    
    return app
