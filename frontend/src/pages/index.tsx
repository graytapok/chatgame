import { Route, Routes } from "react-router-dom";

import AppLayout from "src/components/AppLayout";

import AuthRoutes from "./_auth";
import GameRoutes from "./game";
import TestRoutes from "./test";
import About from "./About";
import Home from "./Home";

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/test/*" element={<TestRoutes />} />
      <Route path="/game/*" element={<GameRoutes />} />
      <Route path="/*" element={<AuthRoutes />} />

      <Route path="*" element={<p>Not Found</p>} />
    </Route>
  </Routes>
);

export default AppRoutes;
