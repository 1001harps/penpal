import { ServerAction, ServerEvent } from "./types";
import { EventListener } from "./events";

const makeUrl = (baseUrl: string, username: string, roomId?: string) => {
  let url = `${baseUrl}?username=${username}`;

  if (roomId) {
    url += `&roomId=${roomId}`;
  }

  return url;
};

export class ServerConnection extends EventListener<ServerEvent> {
  socket: WebSocket;

  constructor(baseUrl: string, username: string, roomId?: string) {
    super();
    const url = makeUrl(baseUrl, username, roomId);
    const socket = new WebSocket(url);

    socket.addEventListener("open", () => {
      console.log("connection opened");
    });

    socket.addEventListener("message", (event) => {
      console.log("message ", event.data);
      const message: ServerEvent = JSON.parse(event.data);
      this.notify(message);
    });

    this.socket = socket;
  }

  dispatch(event: ServerAction) {
    this.socket.send(JSON.stringify(event));
  }
}
