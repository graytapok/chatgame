from random import randint
from typing import Literal
from uuid import UUID
from pydantic import BaseModel

from chatgame.blueprints.statistics import StatisticsService
from .TictactoeGame import TictactoeGame
from .Player import Player
from ...constants import Game


class TictactoeManager(BaseModel):
    unmatched_players: list[str] = []
    players: dict[str, Player] = {}
    games: dict[str, TictactoeGame] = {}

    def add_player(self, sid: str, username: str | None, user_id: UUID | None, elo: int | None):
        if not username:
            username = f"Guest{randint(1000, 9999)}"

        player = Player(sid=sid, username=username, user_id=user_id, elo=elo)

        for up_sid in self.unmatched_players:
            potential_opponent = self.players[up_sid]

            if user_id is None and potential_opponent.user_id is None:    # both guests
                potential_opponent.opponent_id = sid
                player.opponent_id = up_sid

                self.unmatched_players.remove(up_sid)

                break

            elif (
                    user_id is not None                             # <- both authenticated
                    and potential_opponent.user_id is not None      # <-
                    and potential_opponent.user_id != user_id       # not the same player
                    and abs(elo - potential_opponent.elo) < 200     # valid elo difference
            ):
                potential_opponent.opponent_id = sid
                player.opponent_id = up_sid

                self.unmatched_players.remove(up_sid)

                break

        self.players.update({
            sid: player
        })

        if player.opponent_id is None:
            self.unmatched_players.append(sid)

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

        winner = game.check_winner()

        if winner:
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
        player = self.get_player(sid)
        game = self.get_game(sid)

        res = {}

        if game:
            if game.status != "finished":
                diff_elo = self.game_over(player, opponent, game, Game.TICTACTOE, opponent.symbol)
                res.update({"elo": diff_elo})

        if opponent:
            res.update({"emit": ""})

        if sid in self.players:
            room = self.get_room(sid)

            if room in self.games:
                del self.games[room]
                res.update({"close": ""})

            del self.players[sid]

        if sid in self.unmatched_players: self.unmatched_players.remove(sid)

        return res

    @staticmethod
    def game_over(player: Player, opponent: Player, game, game_name: Game, winner: Literal["X", "O", "draw"]):
        game.status = "finished"

        if player.symbol == winner:
            outcome = "win"
        elif opponent.symbol == winner:
            outcome = "loss"
        else:
            outcome = "draw"

        player_elo = None
        opponent_elo = None

        if player.user_id and opponent.user_id:
            elos = StatisticsService.register_played_game(player.user_id, opponent.user_id, game_name, outcome)  # type: ignore

            player_elo = elos["player_elo"]
            opponent_elo = elos["opponent_elo"]

        return {
            "winner": winner,
            f"{player.symbol}_elo": player_elo,
            f"{opponent.symbol}_elo": opponent_elo
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