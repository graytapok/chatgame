from flask import Blueprint

bp = Blueprint("auth", __name__)

from .views import (
    login,
    logout,
    register,
    confirm_email,
    resend_email,
    forgot_password,
    change_password
)

from . import handlers, views

bp.add_url_rule("/login", view_func=login.Login.as_view("login"))
bp.add_url_rule("/logout", view_func=logout.Logout.as_view("logout"))
bp.add_url_rule("/register", view_func=register.Register.as_view("register"))
bp.add_url_rule("/confirm_email", view_func=confirm_email.ConfirmEmail.as_view("confirm_email"))
bp.add_url_rule("/resend_email", view_func=resend_email.ResendEmail.as_view("resend_email"))
bp.add_url_rule("/forgot_password", view_func=forgot_password.ForgotPassword.as_view("forgot_password"))
bp.add_url_rule("/change_password", view_func=change_password.ChangePassword.as_view("change_password"))