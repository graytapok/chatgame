from flask_login import current_user
from flask_socketio import Namespace, join_room, leave_room, emit

from chatgame.blueprints.friends import FriendsService
from chatgame.blueprints.users import UsersService


class Socket(Namespace):
    def on_connect(self):
        if current_user.is_authenticated:
            UsersService.set_online(current_user.username)

            join_room(str(current_user.id))

            friends = FriendsService.get_friends(current_user)

            for i in friends:
                emit("refetch", {"request": "friends"}, to=str(i.id))


    def on_disconnect(self):
        if current_user.is_authenticated:
            UsersService.set_online(current_user.username, online=False)

            leave_room(current_user.id)

            friends = FriendsService.get_friends(current_user)

            for i in friends:
                emit("refetch", {"request": "friends"}, to=str(i.id))