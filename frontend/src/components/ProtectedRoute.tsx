import { Navigate } from "react-router";
import { PropsWithChildren } from "react";

import { useAuth } from "src/hooks/api/auth";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired?: boolean;
  adminRequired?: boolean;
  element?: JSX.Element;
  to?: string;
}

export const ProtectedRoute = ({
  loginRequired = true,
  adminRequired,
  element,
  children,
  to = "/",
}: ProtectedRouteProps) => {
  const { data, status } = useAuth();

  return (
    <>
      {status === "pending" ? (
        <></>
      ) : loginRequired && status === "error" ? (
        <Navigate to={to} />
      ) : adminRequired && status === "success" && !data?.admin ? (
        <Navigate to={to} />
      ) : !loginRequired && status === "success" ? (
        <Navigate to={to} />
      ) : element ? (
        element
      ) : (
        children
      )}
    </>
  );
};
