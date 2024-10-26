from flask.views import MethodView
from flask_login import login_required, logout_user


class Logout(MethodView):
    @login_required
    def get(self):
        logout_user()
        return {}, 204