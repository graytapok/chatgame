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
  loginRequired?: boolean;
  adminRequired?: boolean;
}

export const ProtectedRoute = ({
  loginRequired = true,
  adminRequired,
  children,
}: ProtectedRouteProps) => {
  const { user, query } = useContext(AuthContext) as AuthContext;
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    if (query.isError || (query.isSuccess && user)) {
      if (adminRequired && !user?.admin) {
        setNavigate(true);
      } else if (loginRequired && user === null) {
        toast.error("You must be logged in to access this page!", {
          toastId: "providerMessage",
        });
        setNavigate(true);
      } else if (!loginRequired && user) {
        toast.error("You must be not logged in to access this page!", {
          toastId: "providerMessage",
        });
        setNavigate(true);
      }
    }
  }, [user, query]);

  return navigate ? <Navigate to="/" /> : children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/*" element={<DefaultRoutes />} />
      <Route
        path="/test/*"
        element={
          <ProtectedRoute adminRequired={true}>
            <TestRoutes />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

export const RoutingProvider = () => <RouterProvider router={router} />;
