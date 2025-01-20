import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Rematch = "requested" | "accepted" | "rejected" | "recieved";

export type Status = "searching" | "active" | "finished";

export interface Player {
  username: string;
  symbol: string;
  left: boolean;
  elo?: number;
  diffElo?: number;
}

export interface Field {
  id: number;
  value?: Symbol;
}

export type Winner = "draw" | "X" | "O";

export type Symbol = "X" | "O";

export interface TictactoeState {
  opponent: Player;
  player: Player;

  status: Status;
  turn: Symbol;
  fields: Field[];
  winner: Winner;
  rematch: Rematch;
  nextGame: number;
}

export interface GameBeginProps {
  opponent: Player;
  player: Player;
}

export interface RematchProps {
  type: Rematch;
}

export interface MadeMoveProps {
  turn: Symbol;
  position: number;
  symbol: Symbol;
}

export interface GameOverProps {
  winner: Winner;
  diffXElo?: number;
  diffOElo?: number;
}

const initialState: Partial<TictactoeState> = {};

export const tictactoeSlice = createSlice({
  name: "tictactoe",
  initialState,
  reducers: {
    gameBegin: (state, { payload: p }: PayloadAction<GameBeginProps>) => {
      state.opponent = { ...p.opponent, left: false };
      state.player = { ...p.player, left: false };
      state.turn = "X";
      state.status = "active";
      state.fields = [];

      for (let i = 0; i < 9; i++) {
        state.fields.push({ id: i });
      }
    },
    gameOver: (state, { payload: p }: PayloadAction<GameOverProps>) => {
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

      if (state.fields?.[p.position].id === p.position) {
        state.fields[p.position].value = p.symbol;
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
          state.turn = "X";
          state.fields = [];

          for (let i = 0; i < 9; i++) {
            state.fields.push({ id: i });
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
  nextGame,
  rematch,
} = tictactoeSlice.actions;
