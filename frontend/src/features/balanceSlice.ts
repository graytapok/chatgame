import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Balance } from "src/hooks/api/store";

export interface BalanceState {
  chagcoins?: number;
  items?: Item[];
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  images: object;
}

const initialState: BalanceState = {};

export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    addBalance: (state, { payload }: PayloadAction<Balance>) => {
      state.chagcoins = payload.chagcoins;
      state.items = payload.items;
    },
    removeBalance: () => initialState,
  },
});

export const { addBalance, removeBalance } = balanceSlice.actions;

export default balanceSlice.reducer;
