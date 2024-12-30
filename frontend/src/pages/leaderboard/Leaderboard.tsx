import { useLeaderboard } from "src/api/statistics";
import LeaderboardComponent from "src/components/Leaderboard";
import PageHeading from "src/components/PageHeading";

export default function Leaderboard() {
  const { data, isLoading } = useLeaderboard();

  return (
    <>
      <PageHeading text="Best players of chatgame!" title="Leaderboard" />
      <LeaderboardComponent data={data} isLoading={isLoading} />
    </>
  );
}
