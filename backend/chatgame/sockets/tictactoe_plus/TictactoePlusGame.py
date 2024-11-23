from pydantic import BaseModel, Field as PField
from typing import Literal

from chatgame.constants import tictactoe_possible_wins


class Turn(BaseModel):
    symbol: Literal["X", "O"]
    field: int | None = PField(ge=0, le=8)

class Field(BaseModel):
    id: int
    value: Literal["X", "O"] | None = None
    sub_fields: list[Literal["X", "O"] | None] = PField([None for i in range(0, 9)], repr=False)

class TictactoePlusGame(BaseModel):
    room: str
    rematch: dict[str, bool] = {}
    fields: list[Field] = PField([Field(id=i) for i in range(0, 9)], repr=False)
    status: Literal["playing", "finished"] = "playing"
    turn: Turn = Turn(symbol="X", field=None)

    def check_winner(self):
        for symbol in ["X", "O"]:
            for i in tictactoe_possible_wins:
                if self.fields[i[0]].value == self.fields[i[1]].value == self.fields[i[2]].value == symbol:
                    return symbol

        counter = 0
        for i in range(0, 9):
            if self.fields[i].value:
                counter += 1

        if counter == 9:
            return "draw"

        return None

    def check_field(self, field: int):
        for symbol in ["X", "O"]:
            for i in tictactoe_possible_wins:
                if (self.fields[field].sub_fields[i[0]]
                        == self.fields[field].sub_fields[i[1]]
                        == self.fields[field].sub_fields[i[2]]
                        == symbol):
                    return symbol

        counter = 0
        for i in range(0, 9):
            if self.fields[field].sub_fields[i]:
                counter += 1

        if counter == 9:
            return "draw"

        return None

    def decide_rematch(self, sid: str, decision: bool):
        self.rematch.update({sid: decision})

    def setup_rematch(self):
        self.turn = Turn(symbol="X", field=None)
        self.fields = [Field(id=i) for i in range(0, 9)]
        self.status = "playing"
        self.rematch = {}
