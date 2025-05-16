import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { FriendRequest } from "./useRequest";
import { store } from "src/store";
import { updateRequestsTo } from "src/features/friendsSlice";
import { useAppSelector } from "src/hooks";

export const useRequestsTo = () => {
  const user = useAppSelector((s) => s.user);
  return useQuery({
    queryKey: ["friends", "requests", "to", "me"],
    queryFn: async () => {
      const res = await apiClient.get(`/friends/requests/to/me`);
      const data = res.data as FriendRequest[];

      store.dispatch(updateRequestsTo(data));

      return data;
    },
    retry: false,
    enabled: !!user.id,
  });
};
