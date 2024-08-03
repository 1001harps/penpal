import { ServerEvent } from "./types";
import { EventListener } from "./events";
import { ServerConnection } from "./ServerConnection";
import { SERVER_BASE_URL } from "./config";

export class Room extends EventListener<ServerEvent> {
  serverConnection: ServerConnection | null = null;

  constructor(baseUrl: string, username: string, roomId?: string) {
    super();

    this.serverConnection = new ServerConnection(baseUrl, username, roomId);

    this.serverConnection.addEventListener((serverEvent) => {
      this.notify(serverEvent);
    });
  }

  static create(username: string) {
    return new Room(SERVER_BASE_URL, username);
  }

  static join(username: string, roomId: string) {
    return new Room(SERVER_BASE_URL, username, roomId);
  }

  updateState(patch: string) {
    this.serverConnection?.dispatch({
      type: "update_room_state",
      patch,
    });
  }
}
