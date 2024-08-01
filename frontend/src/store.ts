import { configureStore } from "@reduxjs/toolkit";
import userReducer from "src/features/userSlice";
import tictactoeReducer from "./features/tictactoeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tictactoe: tictactoeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
