import { Route, Routes } from "react-router-dom";

/* import GameOutlet from "../../components/game/Outlet"; */
import GameHome from "./Home";
import TicTacToe from "./TicTacToe";

function GameRoutes() {
  return (
    <Routes>
      <Route /* element={<GameOutlet />} */>
        <Route index element={<GameHome />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
      </Route>
    </Routes>
  );
}

export default GameRoutes;
