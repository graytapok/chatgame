import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";

import { useAppSelector } from "src/hooks";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired?: boolean;
  adminRequired?: boolean;
}

const ProtectedRoute = ({
  loginRequired = true,
  adminRequired,
  children,
}: ProtectedRouteProps) => {
  const user = useAppSelector((state) => state.user);

  if (adminRequired && !user.admin) {
    return <Navigate to="/" />;
  } else if (loginRequired && !user.authenticated) {
    toast.error("You must be logged in to access this page!", {
      toastId: "providerMessage",
    });
    return <Navigate to="/" />;
  } else if (!loginRequired && user.authenticated) {
    toast.error("You must be not logged in to access this page!", {
      toastId: "providerMessage",
    });
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
