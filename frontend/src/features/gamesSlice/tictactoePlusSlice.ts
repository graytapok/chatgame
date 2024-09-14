import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Rematch = "requested" | "accepted" | "rejected" | "recieved";

type Status = "searching" | "active" | "finished";

export type Winner = "draw" | "X" | "O";

export type Symbol = "X" | "O";

export interface Turn {
  field?: number;
  symbol: Symbol;
}

export interface Opponent {
  username: string;
  symbol: string;
  left?: boolean;
}

export interface SubField {
  id: number;
  value?: Symbol;
}

export interface Field extends SubField {
  subFields: SubField[];
}

export interface TictactoeState {
  playerSymbol: string;
  opponent: Opponent;
  status: Status;
  turn: Turn;
  fields: Field[];
  winner: Winner;
  rematch: Rematch;
  nextGame: number;
}

interface GameBeginProps {
  playerSymbol: string;
  opponent: Opponent;
  turn: Turn;
}

interface RematchProps {
  type: Rematch;
}

interface MadeMoveProps {
  field: number;
  subField: number;
  symbol: Symbol;
  turn: Turn;
}

interface FieldWinnerProps {
  field: number;
  symbol: Symbol;
}

const initialState: Partial<TictactoeState> = {};

export const tictactoePlusSlice = createSlice({
  name: "tictactoePlus",
  initialState,
  reducers: {
    gameBegin: (state, { payload: p }: PayloadAction<GameBeginProps>) => {
      state.playerSymbol = p.playerSymbol;
      state.opponent = { ...p.opponent, left: false };
      state.turn = p.turn;
      state.status = "active";
      state.fields = [];

      for (let i = 0; i < 9; i++) {
        const subFields = [];

        for (let j = 0; j < 9; j++) {
          subFields.push({ id: j });
        }

        state.fields.push({ id: i, subFields });
      }
    },
    gameOver: (state, { payload: p }: PayloadAction<{ winner: Winner }>) => {
      state.status = "finished";
      state.winner = p.winner;
      state.turn = undefined;
    },
    madeMove: (state, { payload: p }: PayloadAction<MadeMoveProps>) => {
      state.turn = p.turn;
      if (state.fields?.[p.field]?.subFields?.[p.subField]) {
        state.fields[p.field].subFields[p.subField].value = p.symbol;
      }
    },
    fieldWinner: (state, { payload: p }: PayloadAction<FieldWinnerProps>) => {
      console.log(state.fields?.[p.field]);
      if (state.fields?.[p.field]) {
        state.fields[p.field].value = p.symbol;
      }
    },
    opponentLeft: (state) => {
      state.status = "finished";
      if (state.opponent) {
        state.opponent.left = true;
      }
    },
    rematch: (state, { payload }: PayloadAction<RematchProps>) => {
      switch (payload.type) {
        case "recieved":
          state.rematch = "recieved";
          break;

        case "rejected":
          state.rematch = "rejected";
          break;

        case "requested":
          state.rematch = "requested";
          break;

        case "accepted":
          state.status = "active";
          state.playerSymbol = state.playerSymbol === "X" ? "O" : "X";
          state.winner = undefined;
          state.rematch = undefined;
          state.turn = { symbol: "X" };

          state.fields = [];

          for (let i = 0; i < 9; i++) {
            const subFields = [];

            for (let j = 0; j < 9; j++) {
              subFields.push({ id: j });
            }

            state.fields.push({ id: i, subFields });
          }

          if (state.opponent) {
            state.opponent.symbol = state.opponent?.symbol === "X" ? "O" : "X";
          }

          break;
      }
    },
    nextGame: (state) => {
      if (state.nextGame) {
        state.nextGame += 1;
      } else {
        state.nextGame = 1;
      }
      state = initialState;
    },
    reset: () => initialState,
  },
});

export default tictactoePlusSlice.reducer;

export const {
  fieldWinner,
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  rematch,
  nextGame,
  reset,
} = tictactoePlusSlice.actions;
