from .TictactoePlusGame import TictactoePlusGame
from ..tictactoe import TictactoeManager


class TictactoePlusManager(TictactoeManager):
    games: dict[str, TictactoePlusGame] = {}

    def setup_game(self, sid: str):
        if sid not in self.players:
            return

        player = self.get_player(sid)
        player.symbol = "O"

        self.players[self.unmatched_player_id].opponent_id = sid
        opponent = self.get_opponent(sid)

        self.unmatched_player_id = None

        room = player.sid + opponent.sid

        player.room = room
        opponent.room = room

        self.games.update({room: TictactoePlusGame(room=room)})

    def make_move_plus(self, sid: str, field: int, sub_field: int) -> dict | None:
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        if not opponent:
            return

        if (field < 0 or field > 8) or (sub_field < 0 or sub_field > 8):
            return

        if game.check_winner():
            return

        if game.turn.symbol != player.symbol:
            return

        if game.turn.field is not None and game.turn.field != field:
            return

        if game.fields[field].value:
            return

        if game.fields[field].sub_fields[sub_field]:
            return

        game.fields[field].sub_fields[sub_field] = player.symbol

        res = {"made_move": True}

        if field_winner := game.check_field(field):
            game.fields[field].value = field_winner
            res.update({
                "field_winner": {
                    "winner": field_winner,
                    "field": field
                }
            })

        if winner := game.check_winner():
            game.status = "finished"
            res.update({"winner": winner})

        game.turn.symbol = "X" if player.symbol == "O" else "O"

        if game.fields[sub_field].value:
            game.turn.field = None
        else:
            game.turn.field = sub_field

        return res

    def make_move(self, sid: str, move): return None

    def rematch(self, sid: str, decision: bool):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)
        room = self.get_room(sid)

        if not player or not game:
            return

        if not game.rematch:
            game.decide_rematch(sid, decision)

            return "send request"

        if player.sid not in game.rematch and opponent.sid in game.rematch:
            game.decide_rematch(sid, decision)

            if game.rematch[player.sid] and game.rematch[opponent.sid]:
                ps = player.symbol
                os = opponent.symbol

                player.symbol = os
                opponent.symbol = ps

                game.setup_rematch()

                return "accepted"

            return "rejected"

        return

    def get_game(self, sid: str):
        if sid not in self.players:
            return

        room = self.get_room(sid)

        if room in self.games:
            return self.games[room]

        return None