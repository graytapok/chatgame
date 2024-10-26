from flask.views import MethodView
from flask_login import current_user, login_user
from flask_pydantic import validate
from itsdangerous import BadSignature, SignatureExpired
from pydantic import BaseModel, Field

from chatgame.api.auth.exceptions import TokenExpired, EmailIsNotConfirmed, InvalidToken
from chatgame.api.users.exceptions import UserNotFound
from chatgame.db.models.user import User
from chatgame.extensions import safe

class ChangePasswordBody(BaseModel):
    password: str = Field(min_length=8)

class ChangePasswordQuery(BaseModel):
    user_hash: str = Field(alias="u")
    token: str = Field(alias="t")

class ChangePassword(MethodView):
    init_every_request = False

    @validate()
    def post(self, body: ChangePasswordBody, query: ChangePasswordQuery):
        try:
            user_id = safe.loads(query.user_hash, salt="password-change/user", max_age=60 * 10)
        except SignatureExpired:
            raise TokenExpired
        except BadSignature:
            raise InvalidToken

        user = User.objects(id=user_id).first()
        if user is None:
            raise UserNotFound(attribute=user_id)

        try:
            safe.loads(query.token, salt="password-change/email", max_age=60 * 10)
            if not user.email_confirmed:
                raise EmailIsNotConfirmed
            elif user.password_token == query.token:
                new_password_hash = user.set_password(body.password)
                user.update(password_token="", password_hash=new_password_hash)
            else:
                raise TokenExpired
        except SignatureExpired:
            raise TokenExpired
        except BadSignature:
            raise InvalidToken

        login_user(user)

        return {}, 204