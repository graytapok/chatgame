from flask import current_app, render_template
from flask_mail import Message

from threading import Thread

from chatgame.config import config
from chatgame.extensions import mail
from chatgame.blueprints.users import UsersService
from chatgame.db.models import UserModel


def send_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_registration_email(user: UserModel):
    token = UsersService.create_token(user, "verification")

    msg = Message(
        subject="Registration - Chatgame",
        sender=config.MAIL_USERNAME,
        recipients=[user.email]
    )

    msg.html = render_template(
        "auth/register_email.html",
        link=f"{config.DOMAIN}/register?t={token}"
    )

    Thread(
        target=send_email,
        args=(current_app._get_current_object(), msg)
    ).start()

def send_change_password_email(user: UserModel):
    token = UsersService.create_token(user, "password")

    msg = Message(
        subject="Password Change - Chatgame",
        sender=config.MAIL_USERNAME,
        recipients=[user.email]
    )
    msg.html = render_template(
        "auth/password_email.html",
        link=f"{config.DOMAIN}/forgot_password?t={token}"
    )

    Thread(
        target=send_email,
        args=(current_app._get_current_object(), msg)
    ).start()