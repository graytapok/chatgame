import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "src/hooks/api/friends/useFriends";
import { FriendRequest } from "src/hooks/api/friends/useRequest";

interface FriendsState {
  friends: Friend[];
  requestsTo: FriendRequest[];
  requestsFrom: FriendRequest[];
}

const initialState: Partial<FriendsState> = {};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    updateFriends: (state, { payload }: PayloadAction<Friend[]>) => {
      state.friends = payload;
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
