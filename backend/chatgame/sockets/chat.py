from flask import request
from flask_socketio import Namespace, join_room, leave_room, emit, rooms
from flask_login import current_user

class Chat(Namespace):
    def on_join_chat(self, room):
        join_room(room)

        if current_user.is_authenticated:
            emit(
                "info",
                {"message": f'{current_user.username} joined!'},
                to=room,
                include_self=False
            )
        else:
            emit(
                "info",
                {"message": 'A guest joined!'},
                to=room,
                include_self=False
            )

        emit("info", {"message": "You joined!"})

    def on_message(self, message, room):
        sender = current_user.username if current_user.is_authenticated else "Guest"
        emit(
            "message",
            {"message": message, "sender": sender},
            to=room,
            include_self=False,
            json=True
        )
        emit("message", {"message": message, "sender": "You"}, json=True, to=request.sid)

    def on_leave_chat(self, room):
        leave_room(room)

        if current_user.is_authenticated:
            emit(
                "info",
                {"message": f'{current_user.username} leaved!'},
                to=room,
                include_self=False
            )
        else:
            emit(
                "info",
                {"message": 'The guest leaved!'},
                to=room,
                include_self=False
            )

        emit("info", {"message": "You leaved!"})
