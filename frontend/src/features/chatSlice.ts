import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  type: "info" | "message";
  message: string;
  sender?: string;
}

interface ChatState {
  messages: Message[];
  typedMessage: string;
}

const initialState: ChatState = {
  typedMessage: "",
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, { payload: p }: PayloadAction<Message>) => {
      state.messages.push(p);
    },
    deleteMessage: (state, { payload: p }: PayloadAction<Message>) => {
      state.messages = state.messages.filter(
        (m) =>
          m.type === p.type && m.message === p.message && m.sender === p.sender
      );
    },
    setTypedMessage: (state, { payload: p }: PayloadAction<string>) => {
      state.typedMessage = p;
    },
    reset: () => initialState,
  },
});

export const { addMessage, deleteMessage, setTypedMessage, reset } =
  chatSlice.actions;

export default chatSlice.reducer;
