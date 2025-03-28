import { PlusIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRequest } from "src/hooks/api/friends";
import { AxiosError } from "axios";
import { ApiException } from "src/types/api";
import { useQueryClient } from "@tanstack/react-query";

export const AddFriend = () => {
  const [username, setUsername] = useState<string>("");
  const { mutate, status, error } = useRequest();
  const queryClient = useQueryClient();

  useEffect(() => {
    switch (status) {
      case "success":
        toast.success(`Friend request to ${username} has been sent!`);
        queryClient.invalidateQueries({
          queryKey: ["friends", "requests", "from", "me"],
        });
        setUsername("");
        break;
      case "error":
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as ApiException;

        if (data.message.includes("already exists")) {
          toast.error(`Friend request to ${username} has been already sent!`);
        } else {
          toast.error(data.message);
        }

        break;
    }
  }, [status]);

  return (
    <TextField.Root
      size="3"
      placeholder="Enter a username..."
      onChange={(e) => setUsername(e.target.value)}
      value={username}
    >
      <TextField.Slot>
        <PlusIcon />
      </TextField.Slot>
      <TextField.Slot pr="3">
        <Button color="green" size="1" onClick={() => mutate(username)}>
          Add Friend
        </Button>
      </TextField.Slot>
    </TextField.Root>
  );
};
