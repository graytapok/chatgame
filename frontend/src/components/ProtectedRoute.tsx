import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";

import { useAppSelector } from "src/hooks";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired?: boolean;
  adminRequired?: boolean;
  element?: JSX.Element;
}

const ProtectedRoute = ({
  loginRequired = true,
  adminRequired,
  element,
  children,
}: ProtectedRouteProps) => {
  const user = useAppSelector((state) => state.user);

  if (adminRequired && !user.admin) {
    return <Navigate to="/" />;
  }

  if (loginRequired && !user.authenticated) {
    return <Navigate to="/" />;
  }

  if (!loginRequired && user.authenticated) {
    return <Navigate to="/" />;
  }

  return element ? element : children;
};

export default ProtectedRoute;
