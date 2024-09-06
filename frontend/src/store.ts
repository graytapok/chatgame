import { configureStore } from "@reduxjs/toolkit";
import userReducer from "src/features/userSlice";
import { gamesReducer } from "./features/gamesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
