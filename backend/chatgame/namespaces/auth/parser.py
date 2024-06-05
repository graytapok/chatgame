from flask_restx import reqparse

__all__ = [
    "login_parser",
    "register_parser",
    "email_parser",
    "resend_parser",
    "forgot_parser",
    "change_parser",
    "change_parser_u_t"
]

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
)

register_parser = reqparse.RequestParser()
register_parser.add_argument(
    "username",
    type=str,
    location="json",
    dest="username",
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

forgot_parser = reqparse.RequestParser()
forgot_parser.add_argument("login", location="json", required=True)

change_parser = reqparse.RequestParser()
change_parser.add_argument("newPassword", location="json", required=True, dest="password")
change_parser.add_argument("confirmPassword", location="json", required=True, dest="confirm_password")
change_parser.add_argument("u", location="args", dest="user_hash")
change_parser.add_argument("t", location="args", dest="token")

change_parser_u_t = change_parser.copy()
change_parser_u_t.remove_argument("newPassword")
change_parser_u_t.remove_argument("confirmPassword")
