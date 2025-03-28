import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";

export const useRemoveFriend = () => {
  return useMutation({
    mutationFn: async (friend_id: string) => {
      const { data } = await apiClient.delete(`/friends/${friend_id}`);
      return data;
    },
    mutationKey: ["friends", "remove"],
  });
};
