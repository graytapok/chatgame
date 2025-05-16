import { Route, Routes } from "react-router";

import { ProtectedRoute } from "src/components";
import { ChagchoinsRoutes } from "./Chagcoins";
import { Home } from "./Home";

const StoreRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route
        element={<ProtectedRoute element={<ChagchoinsRoutes />} />}
        path="/chagcoins/*"
      />
    </Routes>
  );
};

export default StoreRoutes;
