import { Route, Routes } from "react-router";

import { AppLayout, ProtectedRoute } from "src/components";

import Home from "./Home";
import About from "./About";
import Friends from "./Friends";
import GameRoutes from "./games";
import TestRoutes from "./test";
import AuthRoutes from "./(auth)";
import LeaderboardRoutes from "./leaderboard";

import { NotFound } from "./NotFound";

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/friends"
        element={<ProtectedRoute element={<Friends />} />}
      />

      <Route path="/test/*" element={<TestRoutes />} />
      <Route path="/game/*" element={<GameRoutes />} />
      <Route path="/leaderboard/*" element={<LeaderboardRoutes />} />

      {AuthRoutes()}

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
