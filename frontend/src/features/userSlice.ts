import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "src/types/auth";

export interface UserState extends Partial<User> {
  authenticated: boolean;
}

const initialState: UserState = {
  authenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.authenticated = true;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.emailConfirmed = action.payload.emailConfirmed;
      state.admin = action.payload.admin;
    },
    logout: (state) => {
      state.authenticated = false;
      state.id = undefined;
      state.username = undefined;
      state.email = undefined;
      state.emailConfirmed = undefined;
      state.admin = undefined;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
