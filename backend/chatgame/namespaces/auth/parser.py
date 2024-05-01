from flask_restx import reqparse

__all__ = (
    "login_parser",
    "register_parser",
    "email_parser",
    "resend_parser",
)

login_parser = reqparse.RequestParser()
login_parser.add_argument(
    "login",
    type=str,
    location="json",
    required=True
)
login_parser.add_argument(
    "password",
    type=str,
    location="json",
    required=True
)
login_parser.add_argument(
    "remember",
    type=bool,
    location="json",
    required=True
)

register_parser = reqparse.RequestParser()
register_parser.add_argument(
    "username",
    type=str,
    location="json",
    required=True
)
register_parser.add_argument(
    "email",
    type=str,
    location="json",
    required=True
)
register_parser.add_argument(
    "password",
    type=str,
    location="json",
    required=True
)
register_parser.add_argument(
    "confirmPassword",
    type=str,
    location="json",
    required=True,
    dest="confirm_password"
)

email_parser = reqparse.RequestParser()
email_parser.add_argument("u", location="args", required=True, dest="user_hash")
email_parser.add_argument("t", location="args", required=True, dest="token")

resend_parser = reqparse.RequestParser()
resend_parser.add_argument("login", location="json", required=True)
