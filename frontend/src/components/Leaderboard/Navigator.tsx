import { TriangleLeftIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { IconButton, Select } from "@radix-ui/themes";
import { useContext } from "react";

import { LeaderboardContext } from ".";

export const Navigator = () => {
  const { page, data, setNewPage } = useContext(LeaderboardContext);
  return (
    <div className="mb-2 flex">
      <IconButton
        size="2"
        variant="soft"
        className="mr-1"
        onClick={() =>
          setNewPage ? setNewPage((page - 1).toString()) : undefined
        }
        disabled={page <= 1}
      >
        <TriangleLeftIcon />
      </IconButton>

      <Select.Root value={page.toString()} onValueChange={setNewPage}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            {data?.pages &&
              Array.from({ length: data?.pages }, (_, i) => (
                <Select.Item key={i} value={(i + 1).toString()}>
                  {i + 1}
                </Select.Item>
              ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <IconButton
        size="2"
        variant="soft"
        className="ml-1"
        onClick={() =>
          setNewPage ? setNewPage((page + 1).toString()) : undefined
        }
        disabled={data?.pages ? page >= data?.pages : true}
      >
        <TriangleRightIcon />
      </IconButton>
    </div>
  );
};
