import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { PropsWithChildren, useEffect, useState, useContext } from "react";

import AuthContext from "src/providers/AuthProvider";

interface ProtectedRouteProps extends PropsWithChildren {
  loginRequired?: boolean;
  adminRequired?: boolean;
}

const ProtectedRoute = ({
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

export default ProtectedRoute;
