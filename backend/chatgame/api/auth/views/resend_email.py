from flask.views import MethodView
from flask_pydantic import validate
from pydantic import BaseModel

from chatgame.extensions import safe
from chatgame.db.utils import get_user_by_login
from chatgame.api.auth.exceptions import EmailIsConfirmed
from chatgame.api.auth.deps import no_login_required
from chatgame.api.auth.utils import send_registration_email
from chatgame.api.users.exceptions import UserNotFound

class ResendEmailBody(BaseModel):
    login: str

class ResendEmail(MethodView):
    init_every_request = False
    
    @no_login_required
    @validate()
    def post(self, body: ResendEmailBody):
        user = get_user_by_login(body.login)

        if user is not None:
            if user.email_confirmed:
                raise EmailIsConfirmed
            else:
                token = safe.dumps(user.email, salt="email-confirm/email")
                user.update(verification_token=token)
                send_registration_email(user.email, user.id, token)
                return {}, 204
        else:
            raise UserNotFound(attribute=body.login)