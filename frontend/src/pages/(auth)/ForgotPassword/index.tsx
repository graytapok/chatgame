import { createContext, Dispatch, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ProtectedRoute } from "src/components";

import Form from "src/pages/(auth)/ForgotPassword/Form";
import Change from "src/pages/(auth)/ForgotPassword/Change";
import Success from "src/pages/(auth)/ForgotPassword/Success";

export const ForgotPasswordContext = createContext<Dispatch<
  React.SetStateAction<string>
> | null>(null);

function ForgotPassword() {
  const [args] = useSearchParams();
  const [render, setRender] = useState("form");
  const token = args.get("t");

  useEffect(() => {
    if (token) {
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
