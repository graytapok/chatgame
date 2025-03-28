import { Spinner } from "@radix-ui/themes";
import { useContext } from "react";
import { LeaderboardUser } from "src/hooks/api/statistics";
import { LeaderboardContext } from ".";

export const Podium = () => {
  const { data } = useContext(LeaderboardContext);

  const style =
    "w-[250px] dark:bg-neutral-500 bg-neutral-300 flex justify-center items-center text-black dark:text-white relative ";

  return (
    <div className="flex justify-center items-end text-4xl m-20 mt-32">
      <div className={style + "h-[180px] rounded-l-lg"}>
        <span>2</span>
        <Top3 user={data?.top3?.at(1)} />
      </div>

      <div className={style + "h-[280px] rounded-t-lg"}>
        <span className="mb-32">1</span>
        <Top3 user={data?.top3?.at(0)} />
      </div>

      <div className={style + "h-[140px] rounded-r-lg"}>
        <span>3</span>
        <Top3 user={data?.top3?.at(2)} />
      </div>
    </div>
  );
};

const Top3 = ({ user }: { user?: LeaderboardUser }) => {
  const { isLoading } = useContext(LeaderboardContext);

  return (
    <div className="flex-col flex absolute top-[-70px]">
      {isLoading ? <Spinner size="3" /> : <span>{user?.username}</span>}
    </div>
  );
};
