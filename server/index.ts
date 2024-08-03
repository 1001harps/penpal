import { WebSocketServer, WebSocket } from "ws";
import { Room } from "./room";
import { handleConnection } from "./handlers";
import { User } from "./types";

const wss = new WebSocketServer({ port: 8080 });

const users: Record<string, User> = {};
const rooms: Record<string, Room> = {};

wss.on("connection", (ws, request) =>
  handleConnection(ws, request, users, rooms)
);
