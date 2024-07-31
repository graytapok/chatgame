import { Routes, Route } from "react-router-dom";

import TestQuery from "./Query";
import TestOutlet from "../../components/test/Outlet";
import TestFetch from "./Fetch";
import TestChat from "./Chat";

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
