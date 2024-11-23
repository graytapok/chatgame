from flask_login import current_user

from random import randint

from .Room import Room
from .SocketUser import SocketUser

class ChatManager:
    def __init__(self):
        self.users = {}
        self.rooms = {}

    def add_user(self, sid, username=None):
        username = current_user.username if current_user.is_authenticated else username or f"Guest{randint(1000, 9999)}"

        self.users.update({"sid": SocketUser(sid, username)})

    def create_room(self, sid, limit=None):
        if sid not in self.users:
            return

        self.rooms.update({"sid": Room(sid, limit)})

    def get_user(self, sid) -> SocketUser | None:
        if sid in self.users:
            return self.users[sid]
        return

    def get_room(self, sid) -> Room | None:
        user = self.get_user(sid)

        if user.room:
            return self.rooms[user.room]

        return