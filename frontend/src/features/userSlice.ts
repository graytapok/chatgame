import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "src/hooks/api/auth";

export interface UserState {
  id?: string;
  username?: string;
  email?: string;
  admin?: boolean;
  createdAt?: string;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<User>) => {
      state.id = payload.id;
      state.username = payload.username;
      state.email = payload.email;
      state.admin = payload.admin;
      state.createdAt = payload.created_at;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
