from chatgame.sockets.chat.user import User


class Room:
    def __init__(self, room, limit):
        self.id = room
        self.limit = limit
        self.users = {}

    def join_room(self, user):
        if user is User and self.limit < len(self.users):
            self.users.update({user.sid: user})
