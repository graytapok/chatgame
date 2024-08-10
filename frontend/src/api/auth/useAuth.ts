import { useQuery } from "@tanstack/react-query";

import { apiClient } from "src/api";
import { login, logout } from "src/features/userSlice";
import { store } from "src/store";

const getAuth = async () => {
  const response = await apiClient
    .get("/auth/")
    .catch(() => store.dispatch(logout()));

  if ("data" in response) {
    store.dispatch(login(response.data.user));
    return response.data;
  }

  return {};
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
