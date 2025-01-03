import { useQuery } from "@tanstack/react-query";

import { store } from "src/store";
import { apiClient } from "src/hooks/api";
import { login, logout } from "src/features/userSlice";

const getAuth = async () => {
  try {
    const res = await apiClient.get("/users/me");
    store.dispatch(login(res.data));
    return res;
  } catch (error) {
    store.dispatch(logout());
    throw error;
  }
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getAuth,
    retry: false,
    enabled: true,
    retryDelay: 0,
  });
};
