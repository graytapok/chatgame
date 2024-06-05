import { Routes, Route } from "react-router-dom";

import TestQuery from "./TestQuery";
import TestOutlet from "./TestOutlet";
import TestParams from "./TestParams";
import TestFetch from "./TestFetch";

function TestRoutes() {
  return (
    <Routes>
      <Route element={<TestOutlet />}>
        <Route index element={<TestQuery />} />
        <Route path=":id" element={<TestParams />} />
        <Route path="/fetch" element={<TestFetch />} />
        <Route path="*" element={<p>Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default TestRoutes;
