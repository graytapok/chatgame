import { PropsWithChildren } from "react";

import { useAuth } from "src/api/auth";

const AuthProvider = ({ children }: PropsWithChildren) => {
  useAuth();
  return children;
};

export default AuthProvider;
