import { Button, Spinner, Text, Tooltip } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import { useAppSelector } from "src/hooks";

interface Props {
  className?: string;
  link?: boolean;
}

export const Balance = ({ className, link = false }: Props) => {
  const { chagcoins } = useAppSelector((s) => s.balance);

  const navigate = useNavigate();

  if (link) {
    return (
      <Tooltip content="Click to buy chagcoins">
        <Button
          variant="outline"
          size="3"
          color="gold"
          onClick={() => link && navigate("/store/chagcoins")}
          className={`flex cursor-pointer flex-row p-1 pl-4 pr-3 rounded-full gap-1 ${className}`}
        >
          <Text size="4">
            {chagcoins !== undefined ? chagcoins : <Spinner />}
          </Text>
          <img src="/chagcoin.png" className="w-7 h-7" />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outline"
      size="3"
      color="gold"
      className={`flex cursor-default flex-row p-1 pl-4 pr-3 rounded-full gap-1 ${className}`}
    >
      <Text size="4">{chagcoins !== undefined ? chagcoins : <Spinner />}</Text>
      <img src="/chagcoin.png" className="w-7 h-7" />
    </Button>
  );
};
