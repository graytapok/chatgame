import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "src/providers";

import Register from "./Register";
import Logout from "./Logout";
import Login from "./Login";
import Resend from "./Resend";
import ForgotPassword from "./ForgotPassword";

function DefaultRoutes() {
  return (
    <Routes>
      <Route>
        <Route index element={<p>Home</p>} />
        <Route path="/about" element={<p>About</p>} />
        <Route
          path="/login"
          element={
            <ProtectedRoute loginRequired={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute loginRequired={true}>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/resend"
          element={
            <ProtectedRoute loginRequired={false}>
              <Resend />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="*" element={<p>Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default DefaultRoutes;
