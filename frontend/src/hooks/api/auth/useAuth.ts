import { useQuery } from "@tanstack/react-query";

import { store } from "src/store";
import { reset } from "src/features/friendsSlice";
import { apiClient } from "src/hooks/api";
import { login, logout } from "src/features/userSlice";
import { removeBalance } from "src/features/balanceSlice";

export interface User {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  created_at: string;
}

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/users/me");
        store.dispatch(login(data));

        return data as User;
      } catch (error) {
        store.dispatch(logout());
        store.dispatch(reset());
        store.dispatch(removeBalance());

        throw error;
      }
    },
    retry: false,
  });
};
