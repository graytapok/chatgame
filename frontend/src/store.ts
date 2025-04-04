import { configureStore } from "@reduxjs/toolkit";
import userReducer from "src/features/userSlice";
import gamesReducer from "./features/gamesSlice";
import chatReducer from "./features/chatSlice";
import friendsReducer from "./features/friendsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    chat: chatReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
