import { PropsWithChildren } from "react";
import { useAppSelector } from "src/hooks";

import { useAuth } from "src/hooks/api/auth";
import {
  useFriends,
  useRequestsFrom,
  useRequestsTo,
} from "src/hooks/api/friends";
import { FriendsSocket } from "src/sockets/friends";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useAuth();

  useFriends();
  useRequestsFrom();
  useRequestsTo();

  const user = useAppSelector((state) => state.user);

  const socketManager = new FriendsSocket();

  socketManager.useSockets(user);

  return children;
};
