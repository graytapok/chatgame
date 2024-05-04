import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import TestRoutes from "./pages/test/TestRoutes";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/about" element={<p>About</p>} />
        <Route path="/test/*" element={<TestRoutes />} />
        <Route path="*" element={<p>Not Found</p>} />
      </Routes>
    </>
  );
};

export default App;
