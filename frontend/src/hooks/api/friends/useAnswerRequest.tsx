import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";
import { FriendRequest } from "./useRequest";

interface FriendRequestAnswerParams {
  requestId: number;
  answer: "accept" | "reject";
}

export const useAnswerRequests = () => {
  return useMutation({
    mutationFn: async (args: FriendRequestAnswerParams) => {
      const { data } = await apiClient.patch(
        `/friends/requests/${args.requestId}?answer=${args.answer}`
      );
      return data as FriendRequest;
    },
    mutationKey: ["friends", "requests", "answer"],
  });
};
