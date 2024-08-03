export type ServerAction = {
  type: "update_room_state";
  patch: string;
};

export type ServerEventMetadata = {
  userId: string;
  username: string;
  roomId: string;
};

export type ServerEvent =
  | {
      type: "joined";
      metadata: ServerEventMetadata;
    }
  | {
      type: "left";
      metadata: ServerEventMetadata;
    }
  | {
      type: "room_state_change";
      metadata: ServerEventMetadata;
      patch: string;
    };
