import { combineSlices } from "@reduxjs/toolkit";
import { tictactoeSlice } from "./tictactoeSlice";
import { tictactoePlusSlice } from "./tictactoePlusSlice";

export default combineSlices(tictactoePlusSlice, tictactoeSlice);
