import { useState, createContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import RegisterConfirm from "./Confirm";
import RegisterForm from "./Form";

import { useConfirmRegister } from "src/api/auth";
import { ProtectedRoute } from "src/providers";

export const RegisterContext = createContext<ReturnType<
  typeof useConfirmRegister
> | null>(null);

function Register() {
  const fetchConfirm = useConfirmRegister();

  const [render, setRender] = useState("form");
  const [args] = useSearchParams();
  const userHash = args.get("u");
  const token = args.get("t");

  useEffect(() => {
    if (userHash && token && fetchConfirm.isIdle) {
      fetchConfirm.mutate({ userHash, token });
      setRender("confirm");
    }
  }, [fetchConfirm]);

  return (
    <RegisterContext.Provider value={fetchConfirm}>
      {render === "form" ? (
        <ProtectedRoute loginRequired={false}>
          <RegisterForm />
        </ProtectedRoute>
      ) : (
        <RegisterConfirm />
      )}
    </RegisterContext.Provider>
  );
}

export default Register;
