import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "src/types/auth";

export interface UserState extends Partial<User> {
  authenticated: boolean;
}

const initialState: UserState = {
  authenticated: false,
};

interface ApiResponse {
  id: string;
  username: string;
  email: string;
  email_confirmed: boolean;
  admin: boolean;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ApiResponse>) => {
      state.authenticated = true;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.emailConfirmed = action.payload.email_confirmed;
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
