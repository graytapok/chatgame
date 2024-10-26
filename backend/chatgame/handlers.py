from flask import Blueprint

from chatgame.extensions import db

bp = Blueprint("handlers", __name__)

@bp.app_errorhandler(400)
def bad_request(e):
    return {"detail": "Bad request"}, 400

@bp.app_errorhandler(404)
def page_not_found(e):
    return {"detail": "Page not found"}, 404

@bp.app_errorhandler(405)
def method_not_allowed(e):
    return {"detail": "Method not allowed"}, 405

@bp.app_errorhandler(415)
def method_not_allowed(e):
    return {"detail": "Unsupported Media Type"}, 415

@bp.app_errorhandler(500)
def internal_server_error(e):
    db.session.rollback()
    return {"detail": "Internal Server Error"}, 500
