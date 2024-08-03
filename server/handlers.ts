import { WebSocket } from "ws";
import { randomUUID } from "crypto";
import { IncomingMessage } from "http";
import { Room, ServerAction, ServerEvent } from "./room";
import { User } from "./types";

export const handleConnection = (
  ws: WebSocket,
  request: IncomingMessage,
  users: Record<string, User>,
  rooms: Record<string, Room>
) => {
  const params = new URLSearchParams(request.url?.split("?")[1]);
  const username = params.get("username");

  if (!username) throw `connection established without username`;

  const connectionId = randomUUID().toString();
  const user: User = { id: connectionId, name: username, connection: ws };
  users[connectionId] = user;

  let roomId = params.get("roomId");

  console.log("roomID", roomId);

  // create new room
  if (!roomId) {
    roomId = randomUUID();
    rooms[roomId] = new Room(roomId);
  }

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("message from %s: %s", connectionId, data);

    const message = JSON.parse(data.toString()) as ServerAction;

    switch (message.type) {
      case "update_room_state":
        const room = rooms[roomId as string];
        const event: ServerEvent = {
          type: "room_state_change",
          patch: message.patch,
          metadata: {
            userId: user.id,
            username: user.name,
            roomId: roomId as string,
          },
        };

        room.dispatchToOthers(user, event);
        break;
    }
  });

  rooms[roomId].connect(user);
};
