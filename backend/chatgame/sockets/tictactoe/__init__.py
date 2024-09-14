from flask import request
from flask_login import current_user
from flask_socketio import join_room, emit, close_room, Namespace

from .manager import TictactoeManager

manager = TictactoeManager()


class TictactoeSocket(Namespace):
    def on_connect(self):
        sid = request.sid

        username = None

        if current_user.is_authenticated:
            username = current_user.username

        unmatched_before = manager.unmatched_player_id

        manager.add_player(sid, username=username)

        if unmatched_before is not None:
            manager.setup_game(sid)

            room = manager.get_room(sid)
            player = manager.get_player(sid)
            opponent = manager.get_opponent(sid)

            join_room(room)
            join_room(room, sid=opponent.sid)

            game = manager.get_game(sid)

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": player.symbol,
                        "username": player.username
                    },
                    "symbol": opponent.symbol
                },
                json=True,
                to=opponent.sid
            )

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": opponent.symbol,
                        "username": opponent.username
                    },
                    "symbol": player.symbol
                },
                json=True,
                to=sid
            )

    def on_message(self, message: str):
        sid = request.sid

        player = manager.get_player(sid)
        opponent = manager.get_opponent(sid)

        if not player or not opponent: return

        emit(
            "message",
            {
                "type": "message",
                "message": message,
                "sender": player.username
            },
            to=opponent.sid,
            include_self=False,
            json=True
        )

        emit(
            "message",
            {
                "type": "message",
                "message": message,
                "sender": "You"
            },
            json=True,
            to=sid
        )

    def on_make_move(self, move: int):
        sid = request.sid

        player = manager.get_player(sid)
        room = manager.get_room(sid)
        game = manager.get_game(sid)

        res = manager.make_move(sid, move)

        ic(res)

        if res:
            emit(
                "made_move",
                {
                    "position": move,
                    "symbol": player.symbol,
                    "turn": game.turn,
                },
                json=True,
                room=room
            )

            if "winner" in res:
                emit("game_over", {"winner": res["winner"]}, json=True, to=room)

    def on_rematch(self, decision: bool = True):
        sid = request.sid

        opponent = manager.get_opponent(sid)
        room = manager.get_room(sid)

        res = manager.rematch(sid, decision)

        if res == "send request":
            emit(
                "rematch_request",
                to=opponent.sid
            )

        if res == "accepted":
            emit(
                "rematch_accepted",
                to=room
            )

        if res == "rejected":
            emit(
                "rematch_rejected",
                to=opponent.sid
            )

    def on_disconnect(self):
        sid = request.sid

        opponent = manager.get_opponent(sid)
        room = manager.get_room(sid)

        res = manager.disconnect(sid)

        if "emit" in res:
            emit("opponent_left", to=opponent.sid)

        if "close" in res:
            close_room(room)
