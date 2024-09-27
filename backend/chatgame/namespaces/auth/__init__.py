from flask_restx import Namespace

ns = Namespace("auth", description="Authentication operations")

from . import resources

ns.add_resource(resources.Default, "/", endpoint="current_user")
ns.add_resource(resources.Login, "/login", endpoint="login")
ns.add_resource(resources.Logout, "/logout", endpoint="logout")
ns.add_resource(resources.Register, "/register", endpoint="register")
ns.add_resource(resources.ConfirmEmail, "/confirm_email", endpoint="confirm_email")
ns.add_resource(resources.ForgotPassword, "/forgot_password", endpoint="forgot_password")
ns.add_resource(resources.ChangePassword, "/change_password", endpoint="forgot_password_change")
ns.add_resource(resources.ResendConfirmEmail, "/resend_email", endpoint="resend_email")
