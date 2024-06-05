import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import AppLayout from "src/components/AppLayout";
import DefaultRoutes from "src/pages/default";
import TestRoutes from "src/pages/test";
import AuthContext from "./AuthProvider";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired: boolean;
  adminRequired?: boolean;
}

export const ProtectedRoute = ({
  loginRequired = false,
  adminRequired,
  children,
}: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext) as AuthContext;
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    if (loginRequired && user === null) {
      toast.error("You must be logged in to access this page!");
      setNavigate(true);
    }

    if (!loginRequired && user) {
      console.log("aa");
      toast.error("You must be not logged in to access this page!");
      setNavigate(true);
    }

    if (adminRequired && !user?.admin) {
      toast.error("You must be an admin to access this page!");
      setNavigate(true);
    }
  }, [user]);

  return navigate ? <Navigate to="/" /> : children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/*" element={<DefaultRoutes />} />
      <Route
        path="/test/*"
        element={
          <ProtectedRoute adminRequired={true} loginRequired={true}>
            <TestRoutes />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

export const RoutingProvider = () => {
  return <RouterProvider router={router} />;
};
