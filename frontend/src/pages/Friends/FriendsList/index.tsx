import { Separator, Text } from "@radix-ui/themes";
import { FriendCard } from "./FriendCard";
import { useAppSelector } from "src/hooks";

export const FriendsList = ({
  onlyOnline = false,
}: {
  onlyOnline?: boolean;
}) => {
  const friends = useAppSelector((store) => store.friends.friends);

  return (
    <>
      <Text size={"2"}>
        {onlyOnline
          ? `Online friends - ${friends?.filter((fr) => fr.online).length}`
          : `All friends - ${friends?.length}`}
      </Text>

      <Separator size={"4"} className="mt-3 mb-2" />

      <div className="flex flex-col gap-2">
        {!onlyOnline &&
          friends?.map((fr) => {
            return <FriendCard key={fr.id} friend={fr} />;
          })}

        {onlyOnline &&
          friends?.map(
            (fr) => fr.online && <FriendCard key={fr.id} friend={fr} />
          )}
      </div>
    </>
  );
};
