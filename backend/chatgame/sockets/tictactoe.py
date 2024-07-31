import random

from flask import request
from flask_login import current_user
from flask_socketio import join_room, emit, close_room, Namespace, disconnect
from itsdangerous import BadSignature

from chatgame.extensions import safe
from chatgame.database.models import User

unmatched_player_id = None
players = {}
games = {}

def getOpponent(sid):
    if sid in players:
        return players[sid]["opponent"] or None
    return None

def checkWinner(fields):
    possible_wins = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],

        ["1", "4", "7"],
        ["2", "5", "8"],
        ["3", "6", "9"],

        ["1", "5", "9"],
        ["7", "5", "3"]
    ]

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

class TicTacToe(Namespace):
    def on_connect(self, token):
        global unmatched_player_id

        sid = request.sid

        if token:
            try:
                safe.dumps(token, salt="tictactoe_invite")
            except BadSignature:
                emit("invalid_invite")
                disconnect()
        else:
            players.update({
                sid: {
                    "opponent": unmatched_player_id,
                    "symbol": "X",
                    "room": None,
                    "username": current_user.username if current_user.is_authenticated else f"Guest{random.randint(1000, 9999)}",
                }
            })

        if unmatched_player_id:
            players[sid]["symbol"] = "O"
            players[unmatched_player_id]["opponent"] = sid

            unmatched_player_id = None

            opponent_sid = players[sid]["opponent"]

            room = sid + opponent_sid

            players[sid]["room"] = room
            players[opponent_sid]["room"] = room

            join_room(room)
            join_room(room, sid=opponent_sid)

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": players[sid]["symbol"],
                        "username": players[sid]["username"]
                    },
                    "symbol": players[opponent_sid]["symbol"]
                },
                json=True,
                to=opponent_sid
            )

            emit(
                "game_begin",
                {
                    "room": room,
                    "opponent": {
                        "symbol": players[opponent_sid]["symbol"],
                        "username": players[opponent_sid]["username"]
                    },
                    "symbol": players[sid]["symbol"]
                },
                json=True,
                to=sid
            )

            emit("info", {"message": f"You and {players[sid]['username']} joined. The game begins!"}, to=opponent_sid,
                 json=True)
            emit("info", {"message": f"You and {players[opponent_sid]['username']} joined. The game begins!"}, to=sid,
                 json=True)

            games.update({
                room: {
                    "move": "X",
                    "fields": {},
                    "status": "playing"
                }
            })

            for i in range(1, 10):
                games[room]["fields"].update({
                    str(i): ""
                })

            return room
        else:
            unmatched_player_id = sid
            return None

    def on_message(self, message, room):
        if request.sid not in players or not getOpponent(request.sid): return

        osid = getOpponent(request.sid)

        emit(
            "message",
            {
                "message": message,
                "sender": players[request.sid]["username"]
            },
            to=osid,
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
            to=request.sid
        )

    def on_make_move(self, move):
        if not getOpponent(request.sid):
            return

        if int(move) < 0 or int(move) > 10:
            return

        game = games[players[request.sid]["room"]]

        if checkWinner(game["fields"]):
            return

        if game["move"] != players[request.sid]["symbol"]:
            return

        game["move"] = "X" if players[request.sid]["symbol"] == "O" else "O"

        game["fields"].update({
            move: players[request.sid]["symbol"]
        })

        emit(
            "made_move",
            {"position": move, "symbol": players[request.sid]["symbol"], "turn": game["move"]},
            json=True,
            room=players[request.sid]["room"]
        )

        winner = checkWinner(game["fields"])

        if winner:
            emit("game_over", {"winner": winner}, json=True, to=players[request.sid]["room"])

    def on_disconnect(self):
        global unmatched_player_id
        sid = request.sid

        if sid in players:
            room = players[sid]["room"]

            if getOpponent(sid):
                osid = players[request.sid]["opponent"]

                emit("opponent_left", to=osid)

                del players[osid]

            if room in games:
                del games[room]

            del players[sid]
            close_room(room)

        if unmatched_player_id == sid:
            unmatched_player_id = None