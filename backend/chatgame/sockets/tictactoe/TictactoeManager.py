from random import randint
from typing import Literal
from uuid import UUID
from pydantic import BaseModel

from chatgame.blueprints.statistics import StatisticsService
from .TictactoeGame import TictactoeGame
from .Player import Player
from ...constants import Game


class TictactoeManager(BaseModel):
    unmatched_player_id: str | None = None
    players: dict[str, Player] = {}
    games: dict[str, TictactoeGame] = {}

    def add_player(self, sid: str, username: str | None, user_id: UUID | None, elo: int | None):
        if not username:
            username = f"Guest{randint(1000, 9999)}"

        self.players.update({
            sid: Player(sid=sid, username=username, user_id=user_id, opponent_id=self.unmatched_player_id, elo=elo)
        })

        if self.unmatched_player_id is None:
            self.unmatched_player_id = sid

    def setup_game(self, sid: str):
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
            room: TictactoeGame(room=room)
        })

    def make_move(self, sid: str, move: int):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        if not opponent:
            return

        if move < 0 or move > 8:
            return

        if game.check_winner():
            return

        if game.turn != player.symbol:
            return

        game.turn = "X" if player.symbol == "O" else "O"

        game.fields[move] = player.symbol

        if winner := game.check_winner():
            return self.game_over(player, opponent, game, Game.TICTACTOE, winner)

        return {"success": True}

    def rematch(self, sid: str, decision: bool):
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

    def disconnect(self, sid: str):
        opponent = self.get_opponent(sid)

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

    def game_over(self, player: Player, opponent: Player, game, game_name: Game, winner: Literal["X", "O", "draw"]):
        game.status = "finished"

        player_outcome: Literal["win", "loss", "draw"] = "draw"
        opponent_outcome: Literal["win", "loss", "draw"] = "draw"

        if player.symbol == winner:
            player_outcome = "win"
            opponent_outcome = "loss"
        elif opponent.symbol == winner:
            player_outcome = "loss"
            opponent_outcome = "win"

        player_elo = None
        opponent_elo = None

        if player.user_id:
            player_elo = StatisticsService.register_played_game(player.user_id, game_name, player_outcome)

        if opponent.user_id:
            opponent_elo = StatisticsService.register_played_game(opponent.user_id, game_name, opponent_outcome)

        X_elo = player_elo if player.symbol == "X" else opponent_elo
        O_elo = player_elo if player.symbol == "O" else opponent_elo

        return {
            "winner": winner,
            "X_elo": X_elo,
            "O_elo": O_elo
        }

    def get_opponent(self, sid: str):
        if sid not in self.players:
            return

        osid = self.players[sid].opponent_id

        if osid in self.players:
            return self.players[osid]

        return None

    def get_player(self, sid: str):
        if sid not in self.players:
            return
        return self.players[sid]

    def get_room(self, sid: str):
        if sid not in self.players:
            return
        return self.players[sid].room

    def get_game(self, sid: str):
        if sid not in self.players:
            return

        room = self.get_room(sid)

        if room in self.games:
            return self.games[room]

        return None