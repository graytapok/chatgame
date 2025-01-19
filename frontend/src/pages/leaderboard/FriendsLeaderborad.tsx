import { Leaderboard, PageHeading } from "src/components";
import { Link } from "src/components/ui";
import { useFriendsLeaderboard } from "src/hooks/api/statistics";

export default function FriendsLeaderborad() {
  return (
    <>
      <PageHeading
        text="Best players of your friends!"
        title="Friends leaderboard"
      >
        <div className="flex">
          Check out the global <span>&nbsp;</span>
          <Link to="/leaderboard">leaderboard</Link>!
        </div>
      </PageHeading>
      <Leaderboard queryHook={useFriendsLeaderboard} />
    </>
  );
}
