import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FriendRequest } from "src/hooks/api/friends/useRequest";
import { UserState } from "./userSlice";
import { Friend as FriendApi } from "src/hooks/api/friends/useFriends";

interface FriendsState {
  friends: Friend[];
  requestsTo: FriendRequest[];
  requestsFrom: FriendRequest[];
}

export interface Friend extends UserState {
  online: boolean;
  lastSeen?: string;
}

const initialState: Partial<FriendsState> = {};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    updateFriends: (state, { payload }: PayloadAction<FriendApi[]>) => {
      state.friends = payload.map((f) => {
        const friend: Friend = {
          lastSeen: f.last_seen,
          createdAt: f.created_at,
          ...f,
        };

        // @ts-ignore
        delete friend.created_at;
        // @ts-ignore
        delete friend.last_seen;

        return friend;
      });
    },
    updateRequestsTo: (state, { payload }: PayloadAction<FriendRequest[]>) => {
      state.requestsTo = payload;
    },
    updateRequestsFrom: (
      state,
      { payload }: PayloadAction<FriendRequest[]>
    ) => {
      state.requestsFrom = payload;
    },
    reset: () => initialState,
  },
});

export default friendsSlice.reducer;
export const { updateFriends, updateRequestsTo, updateRequestsFrom, reset } =
  friendsSlice.actions;
