import { Navigate } from "react-router";
import { PropsWithChildren } from "react";

import { useAuth } from "src/hooks/api/auth";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired?: boolean;
  adminRequired?: boolean;
  element?: JSX.Element;
}

export const ProtectedRoute = ({
  loginRequired = true,
  adminRequired,
  element,
  children,
}: ProtectedRouteProps) => {
  const { data, status } = useAuth();

  return (
    <>
      {status === "pending" ? (
        <></>
      ) : loginRequired && status === "error" ? (
        <Navigate to="/" />
      ) : adminRequired && status === "success" && !data?.admin ? (
        <Navigate to="/" />
      ) : !loginRequired && status === "success" ? (
        <Navigate to="/" />
      ) : element ? (
        element
      ) : (
        children
      )}
    </>
  );
};
