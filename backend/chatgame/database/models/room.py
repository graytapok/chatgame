from mongoengine import ReferenceField, ListField
from datetime import datetime

from chatgame.extensions import db

class Room(db.Document):
    type = db.StringField(required=True)
    users = ListField(ReferenceField("User"))
    capacity = db.IntField(required=True)
    created_at = db.DateTimeField(default=datetime.now(), db_field="createdAt")

    meta = {"collection": "rooms"}