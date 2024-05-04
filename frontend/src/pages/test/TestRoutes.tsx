import { Routes, Route } from "react-router-dom";
import Test from "./Test";
import QueryButtons from "./TestQueryButtons";
import TestId from "./TestParams";

function TestRoutes() {
  return (
    <Routes>
      <Route element={<Test />}>
        <Route index element={<QueryButtons />} />
        <Route path=":id" element={<TestId />} />
      </Route>
    </Routes>
  );
}

export default TestRoutes;
