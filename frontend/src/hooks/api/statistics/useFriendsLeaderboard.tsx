import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { LeaderboardData, UseLeaderboardParams } from "./useLeaderboard";

export function useFriendsLeaderboard({ page, perPage }: UseLeaderboardParams) {
  return useQuery({
    queryFn: async () => {
      const { data } = await apiClient.get(`/statistics/leaderboard/friends`, {
        params: {
          p: page,
          per: perPage,
        },
      });
      return data as LeaderboardData;
    },
    queryKey: ["statistics", "leaderboard", page, perPage],
  });
}
