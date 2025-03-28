import { useQuery } from "@tanstack/react-query";

import { store } from "src/store";
import { reset } from "src/features/friendsSlice";
import { apiClient } from "src/hooks/api";
import { queryClient } from "src/providers/QueryProvider";
import { login, logout } from "src/features/userSlice";

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

        queryClient.refetchQueries({
          queryKey: ["friends", "me"],
        });

        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "from", "me"],
        });

        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "to", "me"],
        });

        return data as User;
      } catch (error) {
        store.dispatch(logout());
        store.dispatch(reset());

        return undefined;
      }
    },
    retry: false,
  });
};
