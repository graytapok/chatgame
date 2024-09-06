import { Card, Flex, Grid } from "@radix-ui/themes";

import { useAppSelector } from "src/hooks";
import Button from "src/components/ui/Button";

const Fields = ({ makeMove }: { makeMove: (id: string) => void }) => {
  const { fields } = useAppSelector((state) => state.games.tictactoe);
  const dummyFields: JSX.Element[] = [];

  for (let i = 1; i < 10; i++) {
    dummyFields.push(<Field key={i} />);
  }

  return (
    <Card className="w-[400px] h-[400px] p-0">
      <Grid
        columns="3"
        rows="3"
        className="w-[400px] h-[400px] items-center place-content-center"
      >
        {fields
          ? fields.map((field) => (
              <Field
                key={field.id}
                id={field.id}
                value={field.value}
                onClick={() => makeMove(field.id)}
              />
            ))
          : dummyFields}
      </Grid>
    </Card>
  );
};

interface FieldProps {
  onClick?: () => void;
  id?: string;
  value?: "X" | "O";
  dummy?: boolean;
}

const Field = ({ onClick, id, value }: FieldProps) => {
  return (
    <Flex className="items-center justify-center">
      <Button
        id={id}
        className={`h-24 w-24 flex justify-center dark:text-white text-black items-center ${
          value === "X" ? "bg-blue-500" : value === "O" && "bg-red-500"
        }`}
        disabled={value ? true : false}
        color={"gray"}
        variant="soft"
        highContrast={true}
        onClick={onClick}
      >
        {value}
      </Button>
    </Flex>
  );
};

export default Fields;