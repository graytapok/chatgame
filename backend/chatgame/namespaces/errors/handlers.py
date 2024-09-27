from chatgame.extensions import db

from ..errors import bp

@bp.app_errorhandler(400)
def bad_request(e):
    return {"message": "Bad request"}

@bp.app_errorhandler(404)
def page_not_found(e):
    return {"message": "Page not found"}

@bp.app_errorhandler(405)
def method_not_allowed(e):
    return {"message": "Method not allowed"}

@bp.app_errorhandler(500)
def internal_server_error(e):
    db.session.rollback()
    return {"message": "Internal Server Error"}
