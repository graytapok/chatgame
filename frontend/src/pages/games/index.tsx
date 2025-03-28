import { Route, Routes } from "react-router";

import GameHome from "./Home";
import Tictactoe from "./Tictactoe";
import TictactoePlus from "./TictactoePlus";

function GameRoutes() {
  return (
    <Routes>
      <Route index element={<GameHome />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
      <Route path="/tictactoe_plus" element={<TictactoePlus />} />
    </Routes>
  );
}

export default GameRoutes;
