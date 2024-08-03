import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { AudioEngineState, defaultSharedState } from "../audio";

export interface Message {
  username: string;
  userId: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
}

export type SharedState = AudioEngineState;

interface EngineState {
  local: {
    user: User | null;
    connectionStatus: "waiting" | "connected" | "disconnected";
    roomId: string | null;
  };
  shared: SharedState;
}

const initialState: EngineState = {
  local: {
    user: null,
    connectionStatus: "waiting",
    roomId: null,
  },
  shared: defaultSharedState,
};

export const counterSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    connected: (
      state,
      action: PayloadAction<{
        roomId: string;
        username: string;
        userId: string;
      }>
    ) => {
      state.local.connectionStatus = "connected";
      state.local.roomId = action.payload.roomId;
      state.local.user = {
        name: action.payload.username,
        id: action.payload.userId,
      };
    },
    sharedStateChange: (state, action: PayloadAction<SharedState>) => {
      state.shared = action.payload;
    },
  },
});

export const { connected, sharedStateChange } = counterSlice.actions;

export default counterSlice.reducer;
