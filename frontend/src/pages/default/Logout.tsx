import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useLogout } from "src/api/auth";

function Logout() {
  const query = useLogout();

  useEffect(() => {
    console.log(query.status);
    if (query.status === "idle") {
      query.mutate();
    }
    if (query.isSuccess) {
      toast.info("Successfuly logged out!", { toastId: "logout" });
    }
  }, []);

  return <>{query.isSuccess ? <Navigate to="/" /> : "Loading..."}</>;
}

export default Logout;
