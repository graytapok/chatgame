from .game import Game
from ..tictactoe import TictactoeManager


class TictactoePlusManager(TictactoeManager):
    def setup_game(self, sid):
        if sid not in self.players:
            return

        player = self.get_player(sid)
        player.symbol = "O"

        self.players[self.unmatched_player_id].opponent_id = sid
        opponent = self.get_opponent(sid)

        self.unmatched_player_id = None

        room = player.sid + opponent.sid

        player.set_room(room)
        opponent.set_room(room)

        self.games.update({room: Game(room)})

    def make_move_plus(self, sid, field, sub_field):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        if not opponent:
            return

        if (field < 1 or field > 9) or (sub_field < 1 or sub_field > 9):
            return

        if game.check_winner():
            return

        if game.turn != player.symbol:
            return

        game.turn = "X" if player.symbol == "O" else "O"

        if game.fields[field]["value"] == "":
            return

        if game.fields[field]["fields"][sub_field] == "":
            return

        game.fields[field]["fields"][sub_field] = player.symbol

        return {
            "winner": game.check_winner(),
            "field_winner": {
                "field": field,
                "symbol": game.check_fields()
            },
        }

    def make_move(self, sid, move): return None

    def rematch(self, sid, decision):
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

    def get_game(self, sid) -> None | Game:
        if sid not in self.players:
            return

        room = self.get_room(sid)

        if room in self.games:
            return self.games[room]

        return None