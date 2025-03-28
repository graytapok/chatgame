from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from email_validator import validate_email, EmailNotValidError
from itsdangerous import SignatureExpired, BadSignature

from chatgame.blueprints.users.dto import UserValidationErrorDetails
from chatgame.extensions import safe, db
from chatgame.exceptions import *
from chatgame.db.models import UserModel

class UsersService:
    @staticmethod
    def get_all_users() -> list[UserModel]:
        return db.session.query(UserModel).all()

    @staticmethod
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

    @staticmethod
    def create_user(username: str, email: str, password: str, admin: bool = False, email_confirmed: bool = False) -> UserModel:
        UsersService.validate_user(username, email)

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

    @staticmethod
    def create_token(user: UserModel, token_type: Literal["verification", "password"]) -> str:
        token = safe.dumps(user.email, salt="email-confirm/user" if token_type == "verification" else "password/user")

        if token_type == "verification":
            user.verification_token = token
        else:
            user.password_token = token

        db.session.commit()

        return token

    @staticmethod
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

    @staticmethod
    def get_user_or_throw(user_id: str | UUID) -> UserModel:
        user = UserModel.query.where(UserModel.id == user_id).first()

        if user is None:
            raise NotFoundException("User", user_id)

        return user

    @staticmethod
    def get_user_by_username_or_throw(username: str) -> UserModel:
        user = db.session.query(UserModel).where(UserModel.username == username).first()

        if user is None:
            raise NotFoundException("User", username)

        return user

    @staticmethod
    def get_user_by_login(login: str) -> Optional[UserModel]:
        try:
            validate_email(login)
            user = db.session.query(UserModel).filter_by(email=login).first()
        except EmailNotValidError:
            user = db.session.query(UserModel).filter_by(username=login).first()
        return user

    @staticmethod
    def delete_user(user: UserModel = None, username: str = None, user_id: UUID | str = None):
        if user:
            db.session.delete(user)
            db.session.commit()
            return

        if user_id:
            user = UsersService.get_user_or_throw(user_id)
            db.session.delete(user)
            db.session.commit()
            return

        if username:
            user = UsersService.get_user_by_username_or_throw(username)
            db.session.delete(user)
            db.session.commit()
            return

    @staticmethod
    def set_online(username: str, online: bool = True):
        user = UsersService.get_user_by_username_or_throw(username)

        user.online = online

        if online is False:
            user.last_seen = datetime.now()
        else:
            user.last_seen = None

        db.session.commit()