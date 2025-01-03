import { Route, Routes } from "react-router-dom";

import Leaderboard from "./Leaderboard";
import FriendsLeaderborad from "./FriendsLeaderborad";
import { ProtectedRoute } from "src/components";

export default function LeaderboardRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<Leaderboard />} />
        <Route
          path="/friends"
          element={
            <ProtectedRoute
              loginRequired={true}
              element={<FriendsLeaderborad />}
            />
          }
        />
      </Route>
    </Routes>
  );
}
