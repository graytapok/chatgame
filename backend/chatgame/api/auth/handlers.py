from ..auth import bp

from .exceptions import UserIsAuthorized, TokenExpired, EmailIsNotConfirmed, InvalidToken, EmailIsConfirmed


@bp.app_errorhandler(UserIsAuthorized)
def user_is_authorized(e):
    return {"detail": "User is authorized"}, 403

@bp.app_errorhandler(401)
def unauthorized(e):
    return {"detail": "Unauthorized"}, 401

@bp.app_errorhandler(TokenExpired)
def token_expired(e):
    return {"detail": "Token expired"}, 410

@bp.app_errorhandler(EmailIsNotConfirmed)
def email_is_not_confirmed(e):
    return {"detail": "Email is not confirmed"}, 403

@bp.app_errorhandler(EmailIsConfirmed)
def email_is_not_confirmed(e):
    return {"detail": "Email is confirmed"}, 403

@bp.app_errorhandler(InvalidToken)
def invalid_token(e):
    return {"detail": "Invalid token"}, 400