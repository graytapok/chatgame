import { PropsWithChildren } from "react";

import { useAuth } from "src/hooks/api/auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useAuth();
  return children;
};
