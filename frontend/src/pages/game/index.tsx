import { Route, Routes } from "react-router-dom";

import GameHome from "./Home";
import TicTacToe from "./TicTacToe";

function GameRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<GameHome />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
      </Route>
    </Routes>
  );
}

export default GameRoutes;
