from flask import request

from chatgame.extensions import db

from ..errors import errors_bp

from icecream import ic

@errors_bp.app_errorhandler(400)
def bad_request(e):
    ic(e, request.base_url)
    return {"message": "Bad request"}

@errors_bp.app_errorhandler(404)
def page_not_found(e):
    ic(e, request.base_url)
    return {"message": "Page not found"}

@errors_bp.app_errorhandler(405)
def method_not_allowed(e):
    ic(e, request.base_url)
    return {"message": "Method not allowed"}

@errors_bp.app_errorhandler(500)
def internal_server_error(e):
    ic(e, request.base_url)
    db.session.rollback()
    return {"message": "Internal Server Error"}
