from flask.views import MethodView
from flask_login import login_user
from flask_pydantic import validate
from pydantic import BaseModel

from chatgame.api.auth.deps import no_login_required
from chatgame.api.auth.exceptions import EmailIsNotConfirmed
from chatgame.db.utils import get_user_by_login


class LoginBody(BaseModel):
    login: str
    password: str
    remember: bool = True

class Login(MethodView):
    init_every_request = False

    @no_login_required
    @validate()
    def post(self, body: LoginBody):
        user = get_user_by_login(body.login)

        if user is None or not user.check_password(body.password):
            return {"detail": "Invalid credentials"}, 400
        elif user.email_confirmed is not True:
            raise EmailIsNotConfirmed
        else:
            login_user(user, remember=body.remember)
            return {}, 204

