import { DotsVerticalIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Button,
  Card,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRemoveFriend } from "src/hooks/api/friends";
import { Friend } from "src/hooks/api/friends/useFriends";

export const FriendCard = ({ friend }: { friend: Friend }) => {
  const [label, setLabel] = useState<string>();

  useEffect(() => {
    const lastSeen = friend?.last_seen ? new Date(friend.last_seen) : undefined;

    if (lastSeen) {
      const diff = Date.now() - lastSeen.getTime();

      const diffSeconds = diff / 1000;
      const diffMinutes = diffSeconds / 60;
      const diffHours = diffMinutes / 60;
      const diffDays = diffHours / 24;

      if (diffDays >= 1) {
        setLabel(`Last seen ${Math.round(diffDays)} days ago`);
      } else if (diffHours > 1) {
        setLabel(`Last seen ${Math.round(diffHours)} hours ago`);
      } else if (diffMinutes > 1) {
        setLabel(`Last seen ${Math.round(diffMinutes)} minutes ago`);
      } else {
        setLabel(`Last seen a few seconds ago`);
      }
    }
  }, [friend.last_seen]);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <IconButton
            className={`rounded-full ${
              friend.online
                ? "bg-green-500"
                : "dark:bg-neutral-500 bg-neutral-300"
            }`}
            size="1"
          />

          <div className="flex flex-col">
            <Text>{friend.username}</Text>
            {label && <Text size={"1"}>{label}</Text>}
          </div>
        </div>

        <FriendMenu friend={friend} />
      </div>
    </Card>
  );
};

const FriendMenu = ({ friend }: { friend: Friend }) => {
  const { mutate, status } = useRemoveFriend();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (status === "success") {
      toast.success(`Friend ${friend.username} removed.`);
      queryClient.refetchQueries({ queryKey: ["friends", "me"] });
    }
  }, [status]);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="surface">
            <DotsVerticalIcon />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Item color="red" onClick={() => setOpen(true)}>
            <TrashIcon />
            <Text>Remove</Text>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Remove Friend</AlertDialog.Title>

          <AlertDialog.Description size="2">
            Are you sure? {friend.username} will no longer be your friend.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={() => mutate(friend.id)}
              >
                Remove
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};
