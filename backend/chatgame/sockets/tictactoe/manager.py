from random import randint

from chatgame.sockets.tictactoe.game import Game
from chatgame.sockets.tictactoe.player import Player

possible_wins = (
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],

    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],

    ["1", "5", "9"],
    ["7", "5", "3"]
)

class TictactoeManager:
    def __init__(self):
        self.unmatched_player_id = None
        self.players = {}
        self.games = {}

    def add_player(self, sid, username):
        if not username:
            username = f"Guest{randint(1000, 9999)}"

        self.players.update({
            sid: Player(sid, username, self.unmatched_player_id)
        })

        if self.unmatched_player_id is None:
            self.unmatched_player_id = sid

    def setup_game(self, sid):
        if sid not in self.players:
            return

        self.players[sid].symbol = "O"

        self.players[self.unmatched_player_id].opponent_id = sid

        self.unmatched_player_id = None

        opponent = self.get_opponent(sid)
        player = self.get_player(sid)

        room = player.sid + opponent.sid

        self.players[sid].room = room
        self.players[opponent.sid].room = room

        self.games.update({
            room: Game(room)
        })

    def make_move(self, sid, move):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        if not opponent:
            return

        if int(move) < 1 or int(move) > 9:
            return

        if game.check_winner():
            return

        if game.turn != player.symbol:
            return

        game.turn = "X" if player.symbol == "O" else "O"

        game.fields.update({
            move: player.symbol
        })

        winner = game.check_winner()

        if winner:
            game.status = "finished"
            return {"winner": winner}

        return {"success": True}

    def rematch(self, sid, decision):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

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

    def disconnect(self, sid):
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        res = []

        if opponent:
            res.append("emit")

        if sid in self.players:
            room = self.get_room(sid)

            if room in self.games:
                del self.games[room]

            del self.players[sid]
            res.append("close")

        if self.unmatched_player_id == sid:
            self.unmatched_player_id = None

        return res

    def get_opponent(self, sid) -> None | Player:
        if sid not in self.players:
            return

        osid = self.players[sid].opponent_id

        if osid in self.players:
            return self.players[osid]

        return None

    def get_player(self, sid) -> None | Player:
        if sid not in self.players:
            return
        return self.players[sid]

    def get_room(self, sid) -> None | str:
        if sid not in self.players:
            return
        return self.players[sid].room

    def get_game(self, sid) -> None | Game:
        if sid not in self.players:
            return

        room = self.get_room(sid)

        if room in self.games:
            return self.games[room]

        return None