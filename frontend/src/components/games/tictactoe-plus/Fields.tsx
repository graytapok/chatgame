import { Card, Flex, Grid } from "@radix-ui/themes";

import { useAppSelector } from "src/hooks";
import Button from "src/components/ui/Button";
import type { SubField } from "src/features/gamesSlice/tictactoePlusSlice";

type MakeMove = (field: number, subField: number) => void;

interface FieldsProps {
  makeMove: MakeMove;
}

const Fields = ({ makeMove }: FieldsProps) => {
  const { fields } = useAppSelector((state) => state.games.tictactoePlus);
  const dummyFields: JSX.Element[] = [];

  for (let i = 1; i < 10; i++) {
    let fields: SubField[] = [];

    for (let j = 1; j < 10; j++) {
      fields.push({ id: j });
    }

    dummyFields.push(<Field key={i} id={i} fields={fields} />);
  }

  return (
    <Card className="w-[550px] h-[550px] p-0">
      <Grid columns="3" rows="3" className="w-[550px] h-[550px] p-2">
        {fields
          ? fields.map((field, i) => (
              <Field
                key={i}
                id={field.id}
                value={field.value}
                fields={field.subFields}
                makeMove={makeMove}
              />
            ))
          : dummyFields}
      </Grid>
    </Card>
  );
};

interface FieldProps {
  id: number;
  value?: "X" | "O";
  fields: SubField[];
  makeMove?: MakeMove;
}

const Field = ({ id, value, fields, makeMove }: FieldProps) => {
  const { turn } = useAppSelector((state) => state.games.tictactoePlus);
  let bg: string;

  if (turn?.field === id) {
    bg = "bg-neutral-500 dark:bg-neutral-600";
  } else {
    bg = "dark:bg-neutral-800 bg-neutral-100";
  }

  if (value) {
    bg =
      value === "X"
        ? "bg-blue-500 dark:bg-blue-500"
        : "bg-red-500 dark:bg-red-500";
  }

  return (
    <Flex className="items-center justify-center">
      <div
        className={`
          size-40 p-0 flex  rounded-xl justify-center items-center
        dark:text-white text-black
          ${bg}`}
      >
        {value ? (
          <div className="text-8xl mb-2">{value}</div>
        ) : (
          <Grid columns="3" rows="3" className="w-36 h-36">
            {fields?.map((field, i) => (
              <SubField
                key={i}
                value={field.value}
                onClick={makeMove ? () => makeMove(id, field.id) : undefined}
              />
            ))}
          </Grid>
        )}
      </div>
    </Flex>
  );
};

interface SubFieldProps {
  value?: "X" | "O";
  onClick?: () => void;
}

const SubField = ({ value, onClick }: SubFieldProps) => {
  return (
    <Flex className="items-center justify-center">
      <Button
        className={`h-10 w-10 p-0 flex justify-center dark:text-white text-black items-center ${
          value === "X" ? "bg-blue-500" : value === "O" && "bg-red-500"
        }`}
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
