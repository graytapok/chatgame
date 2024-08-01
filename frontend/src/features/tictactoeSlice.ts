import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Opponent {
  username: string;
  symbol: string;
}

export type Winner = "draw" | "X" | "O";

export type Turn = "X" | "O";

export interface TictactoeState {
  playerSymbol: string;
  opponent: Opponent;
  opponentLeft: boolean;
  gameStatus: "searching" | "active" | "finished";
  fields: JSX.Element[];
  turn: Turn;
  winner: Winner;
  nextGame: number;
}

const initialState: Partial<TictactoeState> = {};

interface GameBeginProps {
  playerSymbol: string;
  opponent: Opponent;
  turn: Turn;
}

export const tictactoeSlice = createSlice({
  name: "tictactoe",
  initialState,
  reducers: {
    gameBegin: (state, { payload: p }: PayloadAction<GameBeginProps>) => {
      state.playerSymbol = p.playerSymbol;
      state.opponent = p.opponent;
      state.opponentLeft = false;
      state.turn = p.turn;
      state.gameStatus = "active";
    },
    gameOver: (state, { payload: p }: PayloadAction<{ winner: Winner }>) => {
      state.gameStatus = "finished";
      state.winner = p.winner;
    },
    madeMove: (state, { payload: p }: PayloadAction<{ turn: Turn }>) => {
      state.turn = p.turn;
    },
    opponentLeft: (state) => {
      state.gameStatus = "finished";
      state.opponentLeft = true;
    },
    nextGame: (state) => {
      if (state.nextGame) {
        state.nextGame += 1;
        reset();
      } else {
        state.nextGame = 1;
      }
      state.gameStatus = "searching";
    },
    reset: () => initialState,
  },
});

export default tictactoeSlice.reducer;

export const { gameBegin, gameOver, madeMove, opponentLeft, nextGame, reset } =
  tictactoeSlice.actions;
