import { Socket } from "socket.io-client";
import { useEffect } from "react";

import { manager } from ".";
import { queryClient } from "src/providers/QueryProvider";
import { toast } from "react-toastify";

interface OnRefetchProps {
  request: "friends" | "requests_to" | "requests_from";
}

interface OnReceivedRequestProps {
  username: string;
}

interface OnAnsweredRequestProps {
  username: string;
  answer: "accepted" | "rejected";
}

export class FriendsSocket {
  socket: Socket;

  constructor() {
    this.socket = manager.socket("/friends");
  }

  useSockets = (trigger?: any) => {
    useEffect(() => {
      this.socket.connect();

      this.socket.on("refetch", this.onRefetch);
      this.socket.on("received_request", this.onReceivedRequest);
      this.socket.on("answered_request", this.onAnsweredRequest);

      return () => {
        this.socket.off("refetch");
        this.socket.off("received_request");
        this.socket.off("answered_request");

        this.socket.disconnect();
      };
    }, [trigger]);
  };

  onRefetch(data: OnRefetchProps) {
    switch (data.request) {
      case "friends":
        queryClient.refetchQueries({ queryKey: ["friends", "me"] });
        break;

      case "requests_to":
        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "to", "me"],
        });
        break;

      case "requests_from":
        queryClient.refetchQueries({
          queryKey: ["friends", "requests", "from", "me"],
        });
        break;
    }
  }

  onReceivedRequest(data: OnReceivedRequestProps) {
    queryClient.refetchQueries({
      queryKey: ["friends", "requests", "to", "me"],
    });
    toast.info(`Received a friend request from ${data.username}!`);
  }

  onAnsweredRequest(data: OnAnsweredRequestProps) {
    queryClient.refetchQueries({
      queryKey: ["friends", "requests", "from", "me"],
    });

    if (data.answer == "accepted") {
      queryClient.refetchQueries({
        queryKey: ["friends", "me"],
      });

      toast.success(`${data.username} is now your friend!`);
    }
  }
}
