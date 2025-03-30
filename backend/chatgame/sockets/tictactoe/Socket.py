from flask import request
from flask_login import current_user
from flask_socketio import join_room, emit, close_room, Namespace

from .TictactoeManager import TictactoeManager
from ...blueprints.statistics import StatisticsService
from ...constants import Game


class Socket(Namespace):
    def __init__(self, namespace: str | None = None):
        self.manager = TictactoeManager()
        super().__init__(namespace)

    def on_connect(self):
        sid = request.sid

        if current_user.is_authenticated:
            username = current_user.username
            user_id = current_user.id
            elo = StatisticsService.get_user_sub_statistics(user_id, Game.TICTACTOE).elo
        else:
            username = None
            user_id = None
            elo = None

        self.manager.add_player(sid, user_id=user_id, username=username, elo=elo)

        if sid not in self.manager.unmatched_players:
            self.manager.setup_game(sid)

            room = self.manager.get_room(sid)
            player = self.manager.get_player(sid)
            opponent = self.manager.get_opponent(sid)

            join_room(room)
            join_room(room, sid=opponent.sid)

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": player.symbol,
                        "username": player.username,
                        "elo": player.elo
                    },
                    "player": {
                        "symbol": opponent.symbol,
                        "username": opponent.username,
                        "elo": opponent.elo
                    },
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
                        "username": opponent.username,
                        "elo": opponent.elo
                    },
                    "player": {
                        "symbol": player.symbol,
                        "username": player.username,
                        "elo": player.elo
                    },
                },
                json=True,
                to=sid
            )

    def on_message(self, message: str):
        sid = request.sid

        player = self.manager.get_player(sid)
        opponent = self.manager.get_opponent(sid)

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

        player = self.manager.get_player(sid)
        room = self.manager.get_room(sid)
        game = self.manager.get_game(sid)

        res = self.manager.make_move(sid, move)

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
                emit("game_over", res, json=True, to=room)

    def on_rematch(self, decision: bool = True):
        sid = request.sid

        opponent = self.manager.get_opponent(sid)
        room = self.manager.get_room(sid)

        res = self.manager.rematch(sid, decision)

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

        opponent = self.manager.get_opponent(sid)
        room = self.manager.get_room(sid)

        res = self.manager.disconnect(sid)

        if "emit" in res:
            emit("opponent_left", to=opponent.sid)

        if "elo" in res:
            emit("game_over", res["elo"], json=True, to=room)

        if "close" in res:
            close_room(room)