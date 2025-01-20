import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  GameBeginProps,
  TictactoeState,
  Symbol,
  GameOverProps,
  RematchProps,
} from "./tictactoeSlice";

export interface Turn {
  field?: number;
  symbol: Symbol;
}

export interface SubField {
  id: number;
  value?: Symbol;
}

export interface Field extends SubField {
  subFields: SubField[];
}

type OmitedTictactoeState = Omit<Omit<TictactoeState, "fields">, "turn">;

export interface TictactoePlusState extends OmitedTictactoeState {
  turn: Turn;
  fields: Field[];
}

export interface MadeMoveProps {
  field: number;
  subField: number;
  symbol: Symbol;
  turn: Turn;
}

export interface FieldWinnerProps {
  field: number;
  symbol: Symbol;
}

const initialState: Partial<TictactoePlusState> = {};

export const tictactoePlusSlice = createSlice({
  name: "tictactoePlus",
  initialState,
  reducers: {
    gameBegin: (state, { payload: p }: PayloadAction<GameBeginProps>) => {
      state.player = p.player;
      state.opponent = { ...p.opponent, left: false };
      state.turn = { symbol: "X" };
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
    gameOver: (state, { payload: p }: PayloadAction<GameOverProps>) => {
      console.log(p);

      state.turn = undefined;
      state.status = "finished";
      state.winner = p.winner;

      if (state.player?.symbol == "X") {
        state.player.diffElo = p.diffXElo;
        state.opponent!.diffElo = p.diffOElo;
      } else {
        state.player!.diffElo = p.diffOElo;
        state.opponent!.diffElo = p.diffXElo;
      }
    },
    madeMove: (state, { payload: p }: PayloadAction<MadeMoveProps>) => {
      state.turn = p.turn;
      if (state.fields?.[p.field]?.subFields?.[p.subField]) {
        state.fields[p.field].subFields[p.subField].value = p.symbol;
      }
    },
    fieldWinner: (state, { payload: p }: PayloadAction<FieldWinnerProps>) => {
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
          state.player!.symbol = state.player?.symbol === "X" ? "O" : "X";

          if (
            state.player?.elo &&
            state.player.elo !== null &&
            state.player?.diffElo !== undefined
          ) {
            state.player.elo += state.player.diffElo;
          }

          if (
            state.opponent?.elo &&
            state.opponent.elo !== null &&
            state.opponent?.diffElo !== undefined
          ) {
            state.opponent.elo += state.opponent.diffElo;
          }

          state.player!.diffElo = undefined;
          state.opponent!.diffElo = undefined;
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
