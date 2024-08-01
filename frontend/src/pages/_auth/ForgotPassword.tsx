import { createContext, Dispatch, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProtectedRoute from "src/components/ProtectedRoute";
import Form from "src/components/_auth/forgot-password/Form";
import Change from "src/components/_auth/forgot-password/Change";
import Success from "src/components/_auth/forgot-password/Success";

export const ForgotPasswordContext = createContext<Dispatch<
  React.SetStateAction<string>
> | null>(null);

function ForgotPassword() {
  const [args] = useSearchParams();
  const [render, setRender] = useState("form");
  const userHash = args.get("u");
  const token = args.get("t");

  useEffect(() => {
    if (userHash && token) {
      setRender("change");
    }
  }, []);

  return (
    <ForgotPasswordContext.Provider value={setRender}>
      {render === "change" ? (
        <ProtectedRoute loginRequired={false}>
          <Change />
        </ProtectedRoute>
      ) : render === "form" ? (
        <ProtectedRoute loginRequired={false}>
          <Form />
        </ProtectedRoute>
      ) : (
        render === "success" && <Success />
      )}
    </ForgotPasswordContext.Provider>
  );
}

export default ForgotPassword;
