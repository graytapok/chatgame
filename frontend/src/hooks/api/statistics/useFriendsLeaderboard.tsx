import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";
import { LeaderboardData } from "./useLeaderboard";

export default function useFriendsLeaderboard() {
  return useQuery({
    queryFn: async () => {
      const { data } = await apiClient.get("/statistics/leaderboard/friends");
      return data as LeaderboardData[];
    },
    queryKey: ["statistics", "leaderboard", "friends"],
  });
}
