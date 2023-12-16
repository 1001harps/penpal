import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
const wss = new WebSocketServer({ port: 8080 });

interface Connection {
  ws: WebSocket;
  username: string;
}

const connections: Record<string, Connection> = {};
const rooms: Record<string, string[]> = {};

wss.on("connection", function connection(ws, request) {
  const params = new URLSearchParams(request.url?.split("?")[1]);
  const username = params.get("username");

  if (!username) throw `connection established without username`;

  const connectionId = randomUUID();
  connections[connectionId] = { username, ws };

  let roomId = params.get("roomId");

  // create new room
  if (!roomId) {
    roomId = randomUUID();
    rooms[roomId] = [];
  }

  rooms[roomId].push(connectionId);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("message from %s: %s", connectionId, data);

    const message = JSON.parse(data.toString());

    switch (message.type) {
      case "chat_message":
        const connectionsInRoom = rooms[roomId as string];
        connectionsInRoom.forEach((id) => {
          const { ws } = connections[id];
          ws.send(
            JSON.stringify({
              type: "chat_message",
              userId: id,
              username: username,
              message: message.message,
            })
          );
        });

        break;
    }
  });

  ws.send(
    JSON.stringify({
      type: "connected",
      roomId,
    })
  );
});
