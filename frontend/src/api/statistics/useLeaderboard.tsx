import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";

export interface LeaderboardData {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  email_confirmed: boolean;
  created_at: string;
  statistics: Statistics;
}

interface Statistics {
  id: number;
  user_id: string;
  total_games: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  win_percentage: number;
  sub_statistics: SubStatistics[];
}

interface SubStatistics {
  id: number;
  game_name: string;
  total_statistics_id: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
}

export function useLeaderboard() {
  return useQuery({
    queryFn: async () => {
      const { data } = await apiClient.get("/statistics/leaderboard");
      return data as LeaderboardData[];
    },
    queryKey: ["statistics", "leaderboard"],
  });
}
