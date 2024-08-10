from flask import request
from flask_login import current_user
from flask_socketio import join_room, emit, close_room, Namespace

from .game import TicTacToeManager

manager = TicTacToeManager()

class TicTacToeSocket(Namespace):
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
            join_room(room, sid=opponent["sid"])

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": player["symbol"],
                        "username": player["username"]
                    },
                    "symbol": opponent["symbol"]
                },
                json=True,
                to=opponent["sid"]
            )

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": opponent["symbol"],
                        "username": opponent["username"]
                    },
                    "symbol": player["symbol"]
                },
                json=True,
                to=sid
            )

            emit(
                "info",
                {"message": f"You and {player['username']} joined. The game begins!"},
                to=opponent["sid"],
                json=True
            )

            emit(
                "info",
                {"message": f"You and {opponent['username']} joined. The game begins!"},
                to=sid,
                json=True
            )

    def on_message(self, message):
        sid = request.sid

        player = manager.get_player(sid)
        opponent = manager.get_opponent(sid)

        if not player or not opponent: return

        emit(
            "message",
            {
                "message": message,
                "sender": player["username"]
            },
            to=opponent["sid"],
            include_self=False,
            json=True
        )

        emit(
            "message",
            {
                "message": message,
                "sender": "You"
            },
            json=True,
            to=sid
        )

    def on_make_move(self, move):
        sid = request.sid

        player = manager.get_player(sid)
        room = manager.get_room(sid)
        cur_game = manager.get_game(sid)

        if manager.make_move(sid, move):
            emit(
                "made_move",
                {"position": move, "symbol": player["symbol"], "turn": cur_game["turn"]},
                json=True,
                room=room
            )

            winner = manager.check_winner(sid)

            if winner:
                emit("game_over", {"winner": winner}, json=True, to=room)

    def on_rematch(self, decision=True):
        sid = request.sid

        opponent = manager.get_opponent(sid)
        room = manager.get_room(sid)

        res = manager.rematch(sid, decision)

        if res == "send request":
            emit(
                "rematch_request",
                to=opponent["sid"]
            )

        if res == "accepted":
            emit(
                "rematch_accepted",
                to=room
            )

        if res == "rejected":
            emit(
                "rematch_rejected",
                to=opponent["sid"]
            )

    def on_disconnect(self):
        sid = request.sid

        opponent = manager.get_opponent(sid)
        room = manager.get_room(sid)

        res = manager.disconnect(sid)

        if "emit" in res:
            emit("opponent_left", to=opponent["sid"])

        if "close" in res:
            close_room(room)
