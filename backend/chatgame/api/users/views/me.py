from flask.views import MethodView
from flask_pydantic import validate
from flask_login import login_required, current_user

from chatgame.db.schemas.user import UserRead


class Me(MethodView):
    init_every_request = False

    @login_required
    @validate()
    def get(self):
        return UserRead(
            id=str(current_user.id),
            email=current_user.email,
            username=current_user.username,
            admin=current_user.admin,
            email_confirmed=current_user.email_confirmed
        ), 200

    @login_required
    def patch(self):
        # TODO: patch user
        pass