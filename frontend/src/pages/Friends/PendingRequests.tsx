import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Card, IconButton, Separator, Text } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "src/hooks";

import {
  useAnswerRequests,
  useCancelFriendRequest,
} from "src/hooks/api/friends";
import { FriendRequest } from "src/hooks/api/friends/useRequest";

export const PendingRequests = () => {
  const { requestsFrom, requestsTo } = useAppSelector((store) => store.friends);

  return (
    <>
      <div className="mb-3">
        <Text size={"2"}>Received - {requestsTo?.length}</Text>
        <Separator size={"4"} className="mt-3 mb-2" />
        <div className="flex flex-col gap-2">
          {requestsTo?.map((re) => (
            <Requests key={re.id} request={re} toMe />
          ))}
        </div>
      </div>

      <div>
        <Text size={"2"}>Sent - {requestsFrom?.length}</Text>
        <Separator size={"4"} className="mt-3 mb-2" />

        <div className="flex flex-col gap-2">
          {requestsFrom?.map((re) => (
            <Requests key={re.id} request={re} fromMe />
          ))}
        </div>
      </div>
    </>
  );
};

interface RequestProps {
  request: FriendRequest;
  toMe?: boolean;
  fromMe?: boolean;
}

export const Requests = ({ request, toMe }: RequestProps) => {
  const { mutate: mutateCancel, status: statusCancel } =
    useCancelFriendRequest();
  const { mutate: mutateAnswer, status: statusAnswer } = useAnswerRequests();
  const [answer, setAnswer] = useState<"" | "accepted" | "rejected">("");
  const queryClient = useQueryClient();

  useEffect(() => {
    switch (statusCancel) {
      case "success":
        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "from", "me"],
        });
        toast.success(
          `Friend request to ${request.receiver.username} was canceled!`
        );
        break;
      case "error":
        toast.error(`Friend request couldn't be canceled!`);
        break;
    }
  }, [statusCancel]);

  useEffect(() => {
    switch (statusAnswer) {
      case "success":
        if (answer === "accepted") {
          queryClient.refetchQueries({
            queryKey: ["friends", "me"],
          });
        }
        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "to", "me"],
        });
        toast.success(
          `Friend request from ${request.sender.username} was ${answer}!`
        );
        break;
      case "error":
        toast.error(`Friend request couldn't be answered!`);
        break;
    }
  }, [statusAnswer]);

  const accept = () => {
    mutateAnswer({
      requestId: request.id,
      answer: "accept",
    });
    setAnswer("accepted");
  };

  const rejectOrCancel = () => {
    if (toMe) {
      mutateAnswer({ requestId: request.id, answer: "reject" });
      setAnswer("rejected");
    } else {
      mutateCancel(request.id);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center">
        {toMe ? request.sender.username : request.receiver.username}
        <div className="flex gap-2">
          {toMe && (
            <IconButton variant="outline" color="green" onClick={accept}>
              <CheckIcon />
            </IconButton>
          )}
          <IconButton variant="outline" color="red" onClick={rejectOrCancel}>
            <Cross1Icon />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};
