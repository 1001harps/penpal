import { WebSocket } from "ws";

export interface User {
  id: string;
  connection: WebSocket;
  name: string;
}
