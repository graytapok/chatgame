from enum import Enum


class Game(Enum):
    TICTACTOE = "tictactoe"
    TICTACTOE_PLUS = "tictactoe_plus"

class FriendRequestStatus(Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

tictactoe_possible_wins = (
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
)