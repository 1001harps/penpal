import { AppDispatch, RootState } from ".";
import { ServerEvent } from "../room/types";
import { connected, sharedStateChange } from "./roomSlice";
import * as jsondiffpatch from "jsondiffpatch";

export const roomEventHandler =
  (dispatch: AppDispatch, getState: () => RootState) =>
  (event: ServerEvent) => {
    console.log("roomEventHandler", event);
    if (event.type === "joined") {
      dispatch(
        connected({
          roomId: event.metadata.roomId,
          username: event.metadata.username,
          userId: event.metadata.userId,
        })
      );
    }

    if (event.type === "room_state_change") {
      const sharedState = getState().room.shared;

      jsondiffpatch.patch(sharedState, JSON.parse(event.patch));

      dispatch(sharedStateChange(sharedState));
    }
  };
