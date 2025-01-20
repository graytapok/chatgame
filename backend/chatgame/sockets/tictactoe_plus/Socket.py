from flask import request
from flask_socketio import emit, close_room

from .TictactoePlusManager import TictactoePlusManager
from ..tictactoe import Socket as TictactoeSocket

class Socket(TictactoeSocket):
    def __init__(self, namespace: str | None = None):
        super().__init__(namespace)
        self.manager = TictactoePlusManager()

    def on_make_move_plus(self, field: int, sub_field: int):
        sid = request.sid

        player = self.manager.get_player(sid)
        room = self.manager.get_room(sid)
        game = self.manager.get_game(sid)

        res = self.manager.make_move_plus(sid, field, sub_field)

        if res:
            if "made_move" in res:
                emit(
                    "made_move",
                    {
                        "field": field,
                        "subField": sub_field,
                        "symbol": player.symbol,
                        "turn": game.turn.model_dump()
                    },
                    json=True,
                    room=room
                )

            if "field_winner" in res:
                emit(
                    "field_winner",
                    {
                        "field": field,
                        "symbol": player.symbol
                    },
                    json=True,
                    to=room)

            if "winner" in res:
                emit("game_over", res, json=True, to=room)

    def on_make_move(self, move: int): return None