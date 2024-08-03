import { User } from "./types";

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
      type: "room_state_change";
      metadata: ServerEventMetadata;
      patch: string;
    }
  | {
      type: "left";
      metadata: ServerEventMetadata;
    };

export const applyEventMetadata = (
  event: ServerEvent,
  user: User,
  roomId: string
): ServerEvent => {
  return {
    ...event,
    metadata: {
      userId: user.id,
      username: user.name,
      roomId,
    },
  };
};
export class Room {
  id: string;
  members: User[] = [];

  constructor(id: string) {
    this.id = id;
  }

  connect(user: User) {
    this.members.push(user);

    for (const member of this.members) {
      member.connection.send(
        JSON.stringify({
          type: "joined",
          metadata: {
            userId: user.id,
            username: user.name,
            roomId: this.id,
          },
        } as ServerEvent)
      );
    }
  }

  dispatchToAll(from: User, event: ServerEvent) {
    for (const member of this.members) {
      member.connection.send(JSON.stringify(event));
    }
  }

  dispatchToOthers(from: User, event: ServerEvent) {
    for (const member of this.members) {
      if (member.id === from.id) continue;
      member.connection.send(JSON.stringify(event));
    }
  }
}
