from flask import current_app, render_template
from flask_mail import Message

from threading import Thread

from chatgame.extensions import mail, safe_t

__all__ = ["send_registration_email", "send_change_password_email"]

def send_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_registration_email(email, user_id: str, token):
    user_hash = safe_t.dumps(str(user_id), salt="email-confirm/user")
    msg = Message(
        subject="Registration - Chatgame",
        sender=current_app.config["MAIL_USERNAME"],
        recipients=[email]
    )
    msg.html = render_template(
        "auth/register_email.html",
        link=f"{current_app.config['DOMAIN']}/register?u={user_hash}&t={token}"
    )

    Thread(
        target=send_email,
        args=(current_app._get_current_object(), msg)
    ).start()


def send_change_password_email(email, user_id: str, token):
    user_hash = safe_t.dumps(str(user_id), salt="password-change/user")
    msg = Message(
        subject="Password Change - Chatgame",
        sender=current_app.config["MAIL_USERNAME"],
        recipients=[email]
    )
    msg.html = render_template(
        "auth/password_email.html",
        link=f"{current_app.config['DOMAIN']}/forgot_password?u={user_hash}&t={token}"
    )

    Thread(
        target=send_email,
        args=(current_app._get_current_object(), msg)
    ).start()