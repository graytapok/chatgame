import { Route, Routes } from "react-router";

import { Home } from "./Home";
import { Layout } from "./Layout";
import { Cancel } from "./Cancel";
import { Success } from "./Success";

export const ChagchoinsRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Route>
    </Routes>
  );
};
