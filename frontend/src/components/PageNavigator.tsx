import { TriangleLeftIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { IconButton, Select } from "@radix-ui/themes";

interface PageNavigatorProps {
  setNewPage?: (value: string) => void;
  page: number;
  total_pages?: number;
}

export const PageNavigator = ({
  page,
  setNewPage,
  total_pages,
}: PageNavigatorProps) => {
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
            {total_pages &&
              Array.from({ length: total_pages }, (_, i) => (
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
        disabled={total_pages ? page >= total_pages : true}
      >
        <TriangleRightIcon />
      </IconButton>
    </div>
  );
};
