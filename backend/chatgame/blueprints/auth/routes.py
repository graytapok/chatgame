from flask_login import login_user, login_required, logout_user
from flask_pydantic import validate

from .dtos import *
from .email import send_registration_email, send_change_password_email
from .exceptions import *
from .deps import no_login_required
from ..auth import bp
from chatgame.blueprints.users import utils
from chatgame.exceptions import NotFoundException


@bp.post("/login")
@no_login_required
@validate()
def login(body: LoginBody):
    user = utils.get_user_by_login(body.login)

    if user is None or not user.check_password(body.password):
        raise InvalidCredentialsException()

    if not user.email_confirmed:
        raise EmailIsNotConfirmedException()

    if user.check_password(body.password):
        login_user(user)

    return {}, 204

@bp.get("/logout")
@login_required
def logout():
    logout_user()
    return {}, 204

@bp.post("/register")
@no_login_required
@validate()
def register(body: RegisterBody, query: RegisterQuery):
    user = utils.create_user(body.username, body.email, body.password)

    if query.email:
        send_registration_email(user)

    return {}, 201

@bp.post("/register/confirm")
@no_login_required
@validate()
def confirm_register(query: ConfirmEmailQuery):
    user = utils.check_token(query.token, "verification")

    login_user(user)

    return {}, 204

@bp.post("/register/resend")
@no_login_required
@validate()
def resend_register(body: ResendEmailBody):
    user = utils.get_user_by_login(body.login)

    if user is None:
        raise NotFoundException("User", body.login)

    if user.email_confirmed:
        raise ForbiddenException

    send_registration_email(user)

    return {}, 204

@bp.post("/forgot_password")
@no_login_required
@validate()
def forgot_password(body: ResendEmailBody):
    user = utils.get_user_by_login(body.login)

    if user is None:
        raise NotFoundException("User", body.login)

    send_change_password_email(user)

    return {}, 204

@bp.post("/change_password")
@no_login_required
@validate()
def change_password(body: ChangePasswordBody, query: ChangePasswordQuery):
    user = utils.check_token(query.token, "password")

    user.set_password(body.password)

    login_user(user)

    return {}, 204