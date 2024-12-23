from flask import Flask

from . import auth, users, handlers, statistics, friends

def register_blueprints(app: Flask):
    app.register_blueprint(auth.bp, url_prefix="/api/auth")
    app.register_blueprint(users.bp, url_prefix="/api/users")
    app.register_blueprint(friends.bp, url_prefix="/api/friends")
    app.register_blueprint(statistics.bp, url_prefix="/api/statistics")
    app.register_blueprint(handlers.bp)