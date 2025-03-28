import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { FriendRequest } from "./useRequest";
import { store } from "src/store";
import { updateRequestsFrom } from "src/features/friendsSlice";

export const useRequestsFrom = () => {
  return useQuery({
    queryKey: ["friends", "requests", "from", "me"],
    queryFn: async () => {
      const res = await apiClient.get(`/friends/requests/from/me`);

      const data = res.data as FriendRequest[];

      store.dispatch(updateRequestsFrom(data));

      return data;
    },
    retry: false,
  });
};
