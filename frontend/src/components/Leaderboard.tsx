import { Card, Spinner } from "@radix-ui/themes";
import { LeaderboardData } from "src/api/statistics";

interface LeaderboardPorps {
  isLoading: boolean;
  data: LeaderboardData[] | undefined;
}

interface LeaderboardRowProps {
  place: number;
}

export default function Leaderboard({ data, isLoading }: LeaderboardPorps) {
  return (
    <>
      <div>
        {data?.slice(0, 3).map((data, i) => (
          <div key={data.id}>
            {data.username} {i}
          </div>
        ))}
      </div>
      <Card className="flex flex-col text-center h-[900px]">
        {data?.slice(3).map((data, i) => (
          <div key={data.id}>
            {data.username} {i + 1}
          </div>
        ))}
      </Card>
    </>
  );
}

function LeaderboardRow() {
  return <div>Leaderboard</div>;
}
