from .TictactoePlusGame import TictactoePlusGame
from ..tictactoe import TictactoeManager
from ...constants import Game


class TictactoePlusManager(TictactoeManager):
    games: dict[str, TictactoePlusGame] = {}

    def setup_game(self, sid: str):
        if sid not in self.players:
            return

        opponent = self.get_opponent(sid)
        player = self.get_player(sid)

        room = player.sid + opponent.sid

        player.symbol = "O"
        player.room = room
        opponent.room = room

        self.games.update({
            room: TictactoePlusGame(room=room)
        })

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
            res.update(self.game_over(player, opponent, game, Game.TICTACTOE_PLUS, winner))

        game.turn.symbol = "X" if player.symbol == "O" else "O"

        if game.fields[sub_field].value:
            game.turn.field = None
        else:
            game.turn.field = sub_field

        return res

    def make_move(self, sid: str, move): return None