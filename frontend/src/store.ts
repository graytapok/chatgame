import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "./features/chatSlice";
import userReducer from "src/features/userSlice";
import gamesReducer from "./features/gamesSlice";
import friendsReducer from "./features/friendsSlice";
import balanceReducer from "src/features/balanceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    balance: balanceReducer,
    friends: friendsReducer,
    games: gamesReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
