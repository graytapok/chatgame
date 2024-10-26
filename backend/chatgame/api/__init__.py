from flask import Blueprint

bp = Blueprint("api", __name__, url_prefix="/api")

from . import auth, rooms, users

bp.register_blueprint(auth.bp, url_prefix="/auth")
bp.register_blueprint(rooms.bp, url_prefix="/rooms")
bp.register_blueprint(users.bp, url_prefix="/users")