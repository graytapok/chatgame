import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useLogout } from "src/api/auth";

function Logout() {
  const query = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.status === "idle") {
      query.mutate();
    }
    if (query.status === "error") {
      navigate("/");
    }
  }, [query.status]);

  return <>{query.isSuccess ? <Navigate to="/" /> : "Loading..."}</>;
}

export default Logout;
