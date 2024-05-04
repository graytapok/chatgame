import { useState } from "react";
import { IUser } from "types";

const useAuth = () => {
  const [user, setUser] = useState<IUser | null>();

  return [user, setUser];
};

export default useAuth;
