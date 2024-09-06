import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  TictactoeState,
  Field as SubField,
  GameBeginProps,
  Winner,
  RematchProps,
  Turn,
} from "./tictactoeSlice";

interface Field extends SubField {
  subFields: SubField[];
}

export interface TictactoePlusState extends TictactoeState {
  fields: Field[];
}

interface MadeMoveProps {
  turn: Turn;
  field: string;
  subField: string;
  symbol: Turn;
}

const initialState: Partial<TictactoePlusState> = {};

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

      for (let i = 1; i < 10; i++) {
        const subFields = [];

        for (let j = 1; j < 10; j++) {
          subFields.push({ id: j.toString() });
        }

        state.fields.push({ id: i.toString(), subFields });
      }
    },
    gameOver: (state, { payload: p }: PayloadAction<{ winner: Winner }>) => {
      state.status = "finished";
      state.winner = p.winner;
    },
    madeMove: (state, { payload: p }: PayloadAction<MadeMoveProps>) => {
      state.turn = p.turn;

      if (state.fields) {
        for (let i = 0; i < 10; i++) {
          if (state.fields[i].id === p.field) {
            for (let j = 1; j < 10; j++) {
              if (state.fields[i].subFields[j].id === p.subField) {
                state.fields[i].subFields[j].value = p.symbol;
                break;
              }
            }
          }
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
            const subFields = [];

            for (let j = 1; j < 10; j++) {
              subFields.push({ id: j.toString() });
            }

            state.fields.push({ id: i.toString(), subFields });
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
  gameBegin,
  gameOver,
  madeMove,
  opponentLeft,
  rematch,
  nextGame,
  reset,
} = tictactoePlusSlice.actions;
