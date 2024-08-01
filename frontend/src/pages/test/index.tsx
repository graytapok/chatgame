import { Routes, Route } from "react-router-dom";

import TestChat from "./Chat";
import TestQuery from "./Query";
import TestFetch from "./Fetch";
import TestOutlet from "../../components/test/Outlet";

function TestRoutes() {
  return (
    <Routes>
      <Route element={<TestOutlet />}>
        <Route index element={<TestQuery />} />
        <Route path="/fetch" element={<TestFetch />} />
        <Route path="/chat" element={<TestChat />} />
        <Route path="*" element={<p>Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default TestRoutes;
