import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";

export const useCancelFriendRequest = () => {
  return useMutation({
    mutationFn: async (friendRequestId: number) => {
      const { data } = await apiClient.delete(
        `/friends/requests/${friendRequestId}`
      );
      return data;
    },
    mutationKey: ["friends", "requests", "cancel"],
  });
};
