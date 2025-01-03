import { useLeaderboard } from "src/hooks/api/statistics";
import { Leaderboard as LeaderboardComponent } from "src/components";
import { PageHeading } from "src/components";

export default function Leaderboard() {
  const { data, isLoading } = useLeaderboard();

  return (
    <>
      <PageHeading text="Best players of chatgame!" title="Leaderboard" />
      <LeaderboardComponent data={data} isLoading={isLoading} />
    </>
  );
}
