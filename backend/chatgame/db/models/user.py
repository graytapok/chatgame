from flask_login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash

from chatgame.extensions import db, login


class User(db.Document, UserMixin):
    username = db.StringField(required=True, unique=True, db_field="username")
    email = db.StringField(required=True, unique=True)
    password_hash = db.StringField(db_field="passwordHash")

    admin = db.BooleanField(default=False)
    email_confirmed = db.BooleanField(default=False, db_field="emailConfirmed")

    verification_token = db.StringField(default="", db_field="verificationToken")
    password_token = db.StringField(default="", db_field="passwordToken")

    meta = {"collection": "users"}

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        return self.password_hash

    def check_password(self, password):
        return check_password_hash(str(self.password_hash), password)

@login.user_loader
def load_user(user_id):
    return User.objects(id=user_id).first() # type: ignore