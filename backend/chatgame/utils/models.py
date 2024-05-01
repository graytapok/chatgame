from flask_restx import fields

from chatgame.extensions import api
from chatgame.utils.fields import NotFoundField

__all__ = (
    "token_expired_model",
    "email_required_model",
    "email_already_confirmed_model",
    "validation_model",
    "invalid_input_model",
    "no_login_required_model",
    "login_required_model",

    "user_model",
    "one_user_model",
    "many_users_model",
    "users_not_found_model",
    "user_not_found_model",
)

token_expired_model = api.model(
    "Token Expired",
    {
        "message": fields.String(default="token expired")
    }
)

email_required_model = api.model(
    "Email Confirmation Required",
    {
        "message": fields.String(default="email must be confirmed")
    }
)

email_already_confirmed_model = api.model(
    "Email Already Confirmed",
    {
        "message": fields.String(default="email already confirmed")
    }
)

validation_model = api.model(
    "Validation",
    {
        "message": fields.String(default="validation failed"),
        "errors": fields.Raw(
            example={
                "param1": "error description",
                "param2": "error description",
                "param3": "error description",
            }
        )
    }
)

invalid_input_model = api.model(
    "Invalid Input",
    {
        "message": fields.String(default="invalid input"),
        "errors": fields.Raw(
            example={
                "password": "required"
            }
        )
    }
)

login_required_model = api.model(
    "Login Required",
    {
        "message": fields.String(default="login required")
    }
)

no_login_required_model = api.model(
    "No Login Required",
    {
        "message": fields.String(default="no login required")
    }
)

user_model = api.model(
    "User model",
    {
        "id": fields.String,
        "userName": fields.String,
        "email": fields.String,
        "emailConfirmed": fields.Boolean,
        "admin": fields.Boolean
    }
)

one_user_model = api.model(
    "One User Model",
    {
        "user": fields.Nested(user_model)
    }
)

many_users_model = api.model(
    "Many Users model",
    {
        "users": fields.List(fields.Nested(user_model))
    }
)

users_not_found_model = api.model(
    "Users Not Found",
    {
        "message": NotFoundField("users")
    }
)

user_not_found_model = api.model(
    "User Not Found",
    {
        "message": NotFoundField("user", placeholder="id", attribute="user_id")
    }
)