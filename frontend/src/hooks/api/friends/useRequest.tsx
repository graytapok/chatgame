import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";
import { User } from "../auth";

export interface FriendRequest {
  id: number;
  status: FriendsRequsestStatus;

  sender: User;
  receiver: User;

  send_at: Date;
  expires_at: Date;
}

type FriendsRequsestStatus = "idle" | "accepted" | "rejected";

export const useRequest = () => {
  return useMutation({
    mutationKey: ["friends", "request"],
    mutationFn: async (username: string) => {
      const { data } = await apiClient.post(`/friends/requests/${username}`);
      return data as FriendRequest;
    },
  });
};
