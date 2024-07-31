import { Card, Grid } from "@radix-ui/themes";
import { ReactNode } from "react";

const Fields = ({ fields }: { fields: ReactNode }) => {
  return (
    <Card className="w-[400px] h-[400px] p-0">
      <Grid
        columns="3"
        rows="3"
        className="w-[400px] h-[400px] items-center place-content-center"
      >
        {fields}
      </Grid>
    </Card>
  );
};

export default Fields;
