import { useLeaderboard } from "src/hooks/api/statistics";
import { Leaderboard as LeaderboardComponent } from "src/components";
import { PageHeading } from "src/components";
import { Link } from "src/components/ui";
import { useAppSelector } from "src/hooks";

export default function Leaderboard() {
  const user = useAppSelector((state) => state.user);

  return (
    <>
      <PageHeading text="Best players of chatgame!" title="Leaderboard">
        {user.authenticated && (
          <div className="flex">
            Check out the leaderboard of your<span>&nbsp;</span>
            <Link to="/leaderboard/friends"> friends</Link>!
          </div>
        )}
      </PageHeading>
      <LeaderboardComponent queryHook={useLeaderboard} />
    </>
  );
}
