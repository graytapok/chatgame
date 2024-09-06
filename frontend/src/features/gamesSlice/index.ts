import { combineSlices } from "@reduxjs/toolkit";
import { tictactoeSlice } from "./tictactoeSlice";
import { tictactoePlusSlice } from "./tictactoePlusSlice";

export const gamesReducer = combineSlices(tictactoePlusSlice, tictactoeSlice);
