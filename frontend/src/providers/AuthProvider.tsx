import { createContext, PropsWithChildren } from "react";
import { useAuth } from "src/api/auth";

type AuthContext = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthContext;
