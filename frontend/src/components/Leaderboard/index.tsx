import { Card, Spinner } from "@radix-ui/themes";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import {
  LeaderboardData,
  useFriendsLeaderboard,
  useLeaderboard,
} from "src/hooks/api/statistics";
import { Navigator } from "./Navigator";
import { Podium } from "./Podium";
import { UsersTable } from "./UsersTable";

interface LeaderboardPorps {
  queryHook: typeof useLeaderboard | typeof useFriendsLeaderboard;
}

interface LeaderboardContext {
  isLoading?: boolean;
  data?: LeaderboardData;
  setNewPage?: (value: string) => void;
  page: number;
}

export const LeaderboardContext = createContext<LeaderboardContext>({
  page: 1,
});

export function Leaderboard({ queryHook }: LeaderboardPorps) {
  const [search, setSearch] = useSearchParams();

  const [page, setPage] = useState<number>(Number(search.get("p")) || 1);

  const { data, refetch, isLoading } = queryHook({ page: page, perPage: 25 });

  const setNewPage = (value: string) => {
    setPage(Number(value));
    refetch();
  };

  useEffect(() => {
    setSearch({ p: data?.current_page.toString() || "1" });
    if (data) {
      setPage(data?.current_page);
    }
  }, [data?.current_page]);

  return (
    <LeaderboardContext.Provider
      value={{
        page,
        data,
        isLoading,
        setNewPage,
      }}
    >
      <Podium />

      <Card className="flex flex-col">
        <Navigator />

        <UsersTable />

        {isLoading && <Spinner className="mx-auto my-6" size="3" />}

        <div className="flex justify-center mt-5">
          <Navigator />
        </div>
      </Card>
    </LeaderboardContext.Provider>
  );
}
