from flask_login import UserMixin

from email_validator import validate_email
from werkzeug.security import generate_password_hash, check_password_hash

from chatgame.extensions import db, login
from chatgame.utils.errors import ValidationError

__all__ = (
    "User",
    "load_user",
    "user_validation",
)


def username_validation(username):
    if username is None or username == "":
        raise ValidationError("required", field_name="username")
    if len(username) < 3:
        raise ValidationError("rules", field_name="username")
    if User.objects(username=username).first() is not None:
        raise ValidationError("not unique", field_name="username")


def email_validation(email):
    if email is None or email == "":
        raise ValidationError("required", field_name="email")
    try:
        validate_email(email)
    except Exception as e:
        raise ValidationError("rules", field_name="email")
    if User.objects(email=email).first() is not None:
        raise ValidationError("not unique", field_name="email")


def password_validation(password):
    if password is None or password == "":
        raise ValidationError("required", field_name="password")
    if (len(password) < 8
            or password.isalpha()
            or password.isdigit()
            or password.islower()
            or password.isupper()):
        raise ValidationError(
            "rules",
            field_name="password"
        )


def user_validation(username=None, email=None, password=None, confirm_password=None):
    errors = []
    if username is not None:
        try:
            username_validation(username)
        except ValidationError as v:
            errors.append(v)
    if email is not None:
        try:
            email_validation(email)
        except ValidationError as v:
            errors.append(v)
    if password is not None:
        try:
            password_validation(password)
        except ValidationError as v:
            errors.append(v)
    if (
        password is not None
        and confirm_password is not None
        and password != confirm_password
    ):
        v = ValidationError(
            "rules",
            field_name="confirmPassword"
        )
        errors.append(v)

    if len(errors) > 0:
        raise ValidationError("validation error", errors=errors)


class User(db.Document, UserMixin):
    username = db.StringField(required=True, unique=True, validation=username_validation, db_field="username")
    email = db.StringField(required=True, unique=True, validation=email_validation)
    password_hash = db.StringField(db_field="passwordHash")

    admin = db.BooleanField(default=False)
    email_confirmed = db.BooleanField(default=False, db_field="emailConfirmed")

    verification_token = db.StringField(default="", db_field="verificationToken")
    password_token = db.StringField(default="", db_field="passwordToken")

    meta = {"collection": "users"}

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password, test=False):
        if not test:
            password_validation(password)
        self.password_hash = generate_password_hash(password)
        return self.password_hash

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def validate(self, *args, **kwargs):
        errors = []

        try:
            username_validation(self.username)
        except ValidationError as v:
            errors.append(v)

        try:
            email_validation(self.email)
        except ValidationError as v:
            errors.append(v)

        if len(errors) > 0:
            raise ValidationError("validation error", errors=errors)


@login.user_loader
def load_user(user_id):
    return User.objects(id=user_id).first()
