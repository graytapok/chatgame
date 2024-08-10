from random import randint

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

class TicTacToeManager:
    unmatched_player_id = None
    players = {}
    games = {}

    def add_player(self, sid, username):
        if not username:
            username = f"Guest{randint(1000, 9999)}"

        self.players.update({
            sid: {
                "sid": sid,
                "room": None,
                "symbol": "X",
                "username": username,
                "opponent_id": self.unmatched_player_id
            }
        })

        if self.unmatched_player_id is None:
            self.unmatched_player_id = sid

    def setup_game(self, sid):
        if sid not in self.players:
            return Exception(f"no '{sid}' in players")

        self.players[sid]["symbol"] = "O"

        self.players[self.unmatched_player_id]["opponent_id"] = sid

        self.unmatched_player_id = None

        opponent = self.get_opponent(sid)
        player = self.get_player(sid)

        room = player["sid"] + opponent["sid"]

        self.players[sid]["room"] = room
        self.players[opponent["sid"]]["room"] = room

        self.games.update({
            room: {
                "turn": "X",
                "fields": {},
                "status": "playing",
                "rematch": {}
            }
        })

        for i in range(1, 10):
            self.games[room]["fields"].update({str(i): ""})

    def check_winner(self, sid):
        fields = self.get_game(sid)["fields"]

        for symbol in ["X", "O"]:
            for i in possible_wins:
                if fields[i[0]] == fields[i[1]] == fields[i[2]] == symbol:
                    return symbol

        counter = 0
        for i in range(1, 10):
            if fields[str(i)] != "":
                counter += 1

        if counter == 9:
            return "draw"

        return None

    def make_move(self, sid, move):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)

        if not opponent:
            return

        if int(move) < 0 or int(move) > 10:
            return

        if self.check_winner(sid):
            return

        if game["turn"] != player["symbol"]:
            return

        game["turn"] = "X" if player["symbol"] == "O" else "O"

        game["fields"].update({
            move: player["symbol"]
        })

        return True

    def rematch(self, sid, decision):
        player = self.get_player(sid)
        opponent = self.get_opponent(sid)
        game = self.get_game(sid)
        room = self.get_room(sid)

        if not player or not game:
            return

        if not game["rematch"]:
            game["rematch"].update({sid: decision})

            return "send request"

        if player["sid"] not in game["rematch"] and opponent["sid"] in game["rematch"]:
            game["rematch"].update({sid: decision})

            if game["rematch"][player["sid"]] and game["rematch"][opponent["sid"]]:
                del self.games[room]

                ps = player["symbol"]
                os = opponent["symbol"]

                player["symbol"] = os
                opponent["symbol"] = ps

                self.games.update({
                    room: {
                        "turn": "X",
                        "fields": {},
                        "status": "playing",
                        "rematch": {}
                    }
                })

                for i in range(1, 10):
                    self.games[room]["fields"].update({str(i): ""})

                return "accepted"

            return "rejected"

        return

    def disconnect(self, sid):
        opponent = self.get_opponent(sid)

        res = []

        if opponent:
            del self.players[opponent["sid"]]
            res.append("emit")

        if sid in self.players:
            room = self.get_room(sid)

            if room in self.games:
                del self.games[room]

            del self.players[sid]
            res.append("close")

        if self.unmatched_player_id == sid:
            unmatched_player_id = None

        return res

    def get_opponent(self, sid) -> None | dict:
        if sid not in self.players:
            return

        osid = self.players[sid]["opponent_id"]

        if osid in self.players:
            return self.players[osid]

        return None

    def get_player(self, sid) -> None | dict:
        if sid not in self.players:
            return
        return self.players[sid]

    def get_room(self, sid):
        if sid not in self.players:
            return
        return self.players[sid]["room"]

    def get_game(self, sid):
        if sid not in self.players:
            return

        room = self.get_room(sid)

        if room in self.games:
            return self.games[room]

        return None

