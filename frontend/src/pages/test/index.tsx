import { Routes, Route } from "react-router";

import TestChat from "./Chat";
import TestQuery from "./Query";
import TestFetch from "./Fetch";
import TestOutlet from "./Outlet";

function TestRoutes() {
  return (
    <Routes>
      <Route element={<TestOutlet />}>
        <Route index element={<TestQuery />} />
        <Route path="/fetch" element={<TestFetch />} />
        <Route path="/chat" element={<TestChat />} />
      </Route>
    </Routes>
  );
}

export default TestRoutes;
