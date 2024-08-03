import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { RoomDependencies } from "./types";
import { Room } from "../room/Room";
import { roomEventHandler } from "./listeners";
import { SynthParams } from "../output";
import { AudioEngineState } from "../audio";
import { sharedStateChange } from "./roomSlice";
import { AudioEngineEvent } from "../audio/event";

type AppThunkTypes = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: RoomDependencies;
};

export const createAppAsyncThunk = createAsyncThunk.withTypes<AppThunkTypes>();

export const createRoom = createAppAsyncThunk<void, { username: string }>(
  "room/create",
  async ({ username }, thunkAPI) => {
    const room = Room.create(username);

    thunkAPI.extra.room = room;

    const listener = roomEventHandler(
      thunkAPI.dispatch as AppDispatch,
      thunkAPI.getState
    );
    room.addEventListener(listener);
  }
);

export const joinRoom = createAppAsyncThunk<
  void,
  { username: string; roomId: string }
>("room/join", async ({ username, roomId }, thunkAPI) => {
  const room = Room.join(username, roomId);

  thunkAPI.extra.room = room;

  const listener = roomEventHandler(
    thunkAPI.dispatch as AppDispatch,
    thunkAPI.getState
  );
  room.addEventListener(listener);
});

export const roomStateChanged = createAppAsyncThunk<
  void,
  {
    state: AudioEngineState;
    patch: string;
  }
>("room/updateRoomParam", async ({ patch, state }, thunkAPI) => {
  const room = thunkAPI.extra.room;
  if (!room) return;

  thunkAPI.dispatch(sharedStateChange(state));
  AudioEngineEvent.emit("state-change", JSON.parse(JSON.stringify(state)));
  room.updateState(patch);
});
