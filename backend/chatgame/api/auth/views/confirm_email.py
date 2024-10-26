from flask.views import MethodView
from flask_login import login_user
from flask_pydantic import validate
from itsdangerous import BadSignature, SignatureExpired
from pydantic import BaseModel, Field

from chatgame.extensions import safe
from chatgame.db.models.user import User
from chatgame.api.auth.deps import no_login_required
from chatgame.api.auth.exceptions import TokenExpired, InvalidToken, EmailIsConfirmed
from chatgame.api.users.exceptions import UserNotFound


class ConfirmEmailQuery(BaseModel):
    user_hash: str = Field(alias="u")
    token: str = Field(alias="t")

class ConfirmEmail(MethodView):
    init_every_request = False
    
    @no_login_required
    @validate()
    def post(self, query: ConfirmEmailQuery):
        try:
            user_id = safe.loads(query.user_hash, salt="email-confirm/user", max_age=60 * 10)
        except SignatureExpired:
            raise TokenExpired
        except BadSignature:
            return {"detail": "Invalid user_id"}, 400

        user = User.objects(id=user_id).first()
        if user is None:
            raise UserNotFound(attribute=user_id)

        try:
            safe.loads(query.token, salt="email-confirm/email", max_age=60 * 10)
            if user.email_confirmed:
                raise EmailIsConfirmed
            elif user.verification_token == query.token:
                user.update(verification_token="", email_confirmed=True)
                login_user(user, remember=True)
            else:
                raise TokenExpired
        except SignatureExpired:
            raise TokenExpired
        except BadSignature:
            raise InvalidToken
        
        return {}, 204