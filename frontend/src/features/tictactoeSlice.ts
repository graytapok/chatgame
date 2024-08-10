import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Opponent {
  username: string;
  symbol: string;
  left?: boolean;
}

export interface Field {
  id: string;
  value?: Turn;
}

export type Winner = "draw" | "X" | "O";

export type Turn = "X" | "O";

export interface TictactoeState {
  playerSymbol: string;
  opponent: Opponent;
  status: "searching" | "active" | "finished";
  turn: Turn;
  fields: Field[];
  winner: Winner;
  rematch: "requested" | "accepted" | "rejected" | "recieved";
  nextGame: number;
}

interface GameBeginProps {
  playerSymbol: string;
  opponent: Opponent;
  turn: Turn;
}

interface RematchProps {
  type: "requested" | "recieved" | "accepted" | "rejected";
}

interface MadeMoveProps {
  turn: Turn;
  position: string;
  symbol: Turn;
}

const initialState: Partial<TictactoeState> = {};

export const tictactoeSlice = createSlice({
  name: "tictactoe",
  initialState,
  reducers: {
    gameBegin: (state, { payload: p }: PayloadAction<GameBeginProps>) => {
      state.playerSymbol = p.playerSymbol;
      state.opponent = { ...p.opponent, left: false };
      state.turn = p.turn;
      state.status = "active";
      state.fields = [];

      for (let i = 1; i < 10; i++) {
        state.fields.push({ id: i.toString() });
      }
    },
    gameOver: (state, { payload: p }: PayloadAction<{ winner: Winner }>) => {
      state.status = "finished";
      state.winner = p.winner;
    },
    madeMove: (state, { payload: p }: PayloadAction<MadeMoveProps>) => {
      state.turn = p.turn;

      for (let i = 0; i < 10; i++) {
        if (state.fields && state.fields[i].id === p.position) {
          state.fields[i].value = p.symbol;
          break;
        }
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
          state.turn = "X";
          state.fields = [];

          for (let i = 1; i < 10; i++) {
            state.fields.push({ id: i.toString() });
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

export default tictactoeSlice.reducer;

export const {
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  reset,
  rematch,
  nextGame,
} = tictactoeSlice.actions;
