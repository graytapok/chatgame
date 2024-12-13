from typing import Optional, Literal

from email_validator import validate_email, EmailNotValidError
from itsdangerous import SignatureExpired, BadSignature

from chatgame.blueprints.users.dto import UserValidationErrorDetails
from chatgame.extensions import safe, db
from chatgame.exceptions import *
from chatgame.db.models import UserModel

def validate_user(username: Optional[str] = None, email: Optional[str] = None) -> None:
    details = UserValidationErrorDetails()

    if username:
        if db.session.query(UserModel).filter_by(username=username).first():
            details.username = AlreadyExistsException("User", username).message

    if email:
        if db.session.query(UserModel).filter_by(email=email).first():
            details.email = AlreadyExistsException("User", email).message

    if details.username or details.email:
        raise ApiException(message="Invalid input", status=400, details=details)

def create_user(username: str, email: str, password: str, admin: bool = False, email_confirmed: bool = False) -> UserModel:
    validate_user(username, email)

    user = UserModel(
        username=username,
        email=email,
        password_to_hash=password,
        admin=admin,
        email_confirmed=email_confirmed
    )

    db.session.add(user)
    db.session.commit()

    return user

def create_token(user: UserModel, token_type: Literal["verification", "password"]) -> str:
    token = safe.dumps(user.email, salt="email-confirm/user" if token_type == "verification" else "password/user")

    if token_type == "verification":
        user.verification_token = token
    else:
        user.password_token = token

    db.session.commit()

    return token

def check_token(token: str, token_type: Literal["verification", "password"]) -> UserModel:
    token_label = f"{token_type.capitalize()} token"

    try:
        email = safe.loads(
            token,
            salt="email-confirm/user" if token_type == "verification" else "password/user",
            max_age=60 * 10
        )
    except SignatureExpired:
        raise TokenExpiredException(token_label)
    except BadSignature:
        raise InvalidTokenException(token_label)

    user: UserModel = db.session.query(UserModel).filter_by(email=email).first()

    if user is None:
        raise NotFoundException("User", email)

    if token_type == "verification":
        if user.verification_token != token:
            raise TokenExpiredException(token_label)

        user.verification_token = None
        user.email_confirmed = True
    else:
        if user.password_token != token:
            raise TokenExpiredException(token_label)
        user.password_token = None

    db.session.commit()

    return user

def get_user_or_throw(user_id: str) -> UserModel:
    user: UserModel | None = None

    try:
        user = db.session.get(UserModel, user_id)
    finally:
        if user is None:
            raise NotFoundException("User", user_id)

    return user

def get_user_by_username_or_throw(username: str) -> UserModel:
    user = db.session.query(UserModel).where(UserModel.username == username).first()

    if user is None:
        raise NotFoundException("User", username)

    return user

def get_user_by_login(login: str) -> Optional[UserModel]:
    try:
        validate_email(login)
        user = db.session.query(UserModel).filter_by(email=login).first()
    except EmailNotValidError:
        user = db.session.query(UserModel).filter_by(username=login).first()
    return user

def add_fiend(user: UserModel, username: str):
    if username == user.username:
        raise BadRequestException("The friend must be some else, not you.")

    new_friend = get_user_by_username_or_throw(username)

    user.friends.append(new_friend)
    new_friend.friends.append(user)
    db.session.commit()