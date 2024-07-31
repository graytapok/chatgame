import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "src/components/ProtectedRoute";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import Logout from "./Logout";
import Resend from "./Resend";
import Login from "./Login";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route>
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
            <ProtectedRoute>
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
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
