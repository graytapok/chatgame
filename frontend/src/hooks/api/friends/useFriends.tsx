import { useQuery } from "@tanstack/react-query";

import { User } from "src/hooks/api/auth/useAuth";
import { apiClient } from "..";
import { store } from "src/store";
import { updateFriends } from "src/features/friendsSlice";
import { useAppSelector } from "src/hooks";

export interface Friend extends User {
  online: boolean;
  last_seen?: string;
}

export const useFriends = () => {
  const user = useAppSelector((s) => s.user);
  return useQuery({
    queryKey: ["friends", "me"],
    queryFn: async () => {
      const res = await apiClient.get("/friends/me");
      const data = res.data as Friend[];

      store.dispatch(updateFriends(data));

      return data;
    },
    retry: false,
    enabled: !!user.id,
  });
};
