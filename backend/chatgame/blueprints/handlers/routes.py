from flask import request, current_app

from .dto import ApiExceptionDto

from chatgame.blueprints.handlers import bp
from chatgame.extensions import db
from chatgame.exceptions import ApiException

@bp.app_errorhandler(ApiException)
def api_exception(e: ApiException):
    exception = ApiExceptionDto(
        status=e.status,
        message=e.message,
        path=request.path,
        details=e.details
    )

    return exception.model_dump(mode="json", exclude_none=True), e.status

@bp.app_errorhandler(400)
def bad_request(e):
    exception = ApiExceptionDto(
        status=400,
        message="Bad request",
        path=request.path
    )

    return exception.model_dump(mode="json", exclude_none=True), 400

@bp.app_errorhandler(401)
def unauthorized(e):
    exception = ApiExceptionDto(
        status=401,
        message="Unauthorized",
        path=request.path
    )

    return exception.model_dump(mode="json", exclude_none=True), 401

@bp.app_errorhandler(404)
def page_not_found(e):
    exception = ApiExceptionDto(
        status=404,
        message="Page not found",
        path=request.path
    )

    return exception.model_dump(mode="json", exclude_none=True), 404

@bp.app_errorhandler(405)
def method_not_allowed(e):
    exception = ApiExceptionDto(
        status=404,
        message="Method not allowed",
        path=request.path
    )

    return exception.model_dump(mode="json", exclude_none=True), 405

@bp.app_errorhandler(500)
def internal_server_error(e):
    db.session.rollback()

    exception = ApiExceptionDto(
        status=500,
        message="Internal server error",
        path=request.path
    )

    current_app.logger.error(f"{e.message} - {request.path}")

    return exception.model_dump(mode="json", exclude_none=True), 500