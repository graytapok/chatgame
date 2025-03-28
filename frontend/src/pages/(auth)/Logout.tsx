import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { PageHeading } from "src/components";

import { useLogout } from "src/hooks/api/auth";

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

  return (
    <>
      {query.isSuccess ? (
        <Navigate to="/" />
      ) : (
        <PageHeading title="Logout" text="Logging out!" />
      )}
    </>
  );
}

export default Logout;
