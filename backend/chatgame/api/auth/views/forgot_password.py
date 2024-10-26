from flask.views import MethodView
from flask_pydantic import validate
from pydantic import BaseModel

from chatgame.db.utils import get_user_by_login
from chatgame.extensions import safe
from chatgame.api.auth.utils import send_change_password_email
from chatgame.api.users.exceptions import UserNotFound

class ForgotPasswordBody(BaseModel):
    login: str

class ForgotPassword(MethodView):
    init_every_request = False

    @validate()
    def post(self, body: ForgotPasswordBody):
        user = get_user_by_login(body.login)

        if user is not None:
            token = safe.dumps(user.email, salt="password-change/email")
            send_change_password_email(user.email, user.id, token)
            user.update(password_token=token)
        else:
            raise UserNotFound(attribute=body.login)

        return {}, 204