import { Route, Routes } from "react-router-dom";

import AppLayout from "src/components/AppLayout";

import Home from "./Home";
import About from "./About";
import GameRoutes from "./games";
import TestRoutes from "./test";
import AuthRoutes from "./_auth";
import LeaderboardRoutes from "./leaderboard";

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/test/*" element={<TestRoutes />} />
      <Route path="/game/*" element={<GameRoutes />} />
      <Route path="/leaderboard/*" element={<LeaderboardRoutes />} />

      {AuthRoutes()}

      <Route path="*" element={<p>Not Found</p>} />
    </Route>
  </Routes>
);

export default AppRoutes;
