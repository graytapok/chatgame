import { useQuery } from "@tanstack/react-query";
import { apiClient } from "..";

export interface LeaderboardData {
  total: number;
  pages: number;
  current_page: number;
  next_page?: number;
  prev_page?: number;
  users: LeaderboardUser[];
  top3: LeaderboardUser[];
}

export interface LeaderboardUser {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  email_confirmed: boolean;
  created_at: string;
  rank?: number;
  statistics: Statistics;
}

interface Statistics {
  id: number;
  user_id: string;
  total_games: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  total_elo: number;
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
  elo: number;
}

export interface UseLeaderboardParams {
  page?: number;
  perPage?: number;
}

export function useLeaderboard({ page, perPage }: UseLeaderboardParams) {
  return useQuery({
    queryFn: async () => {
      const { data } = await apiClient.get(`/statistics/leaderboard`, {
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
