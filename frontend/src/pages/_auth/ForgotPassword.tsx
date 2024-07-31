import { useSearchParams } from "react-router-dom";
import { createContext, Dispatch, useEffect, useState } from "react";

import ProtectedRoute from "src/components/ProtectedRoute";
import Success from "src/components/_auth/forgot-password/Success";
import Change from "src/components/_auth/forgot-password/Change";
import Form from "src/components/_auth/forgot-password/Form";

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
