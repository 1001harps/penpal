import {
  ActionCreatorWithPayload,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import roomReducer, {
  chatMessage,
  connected,
  createRoom,
  joinRoom,
  sendChat,
} from "./roomSlice";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: createRoom,
  effect: async (action, listenerApi) => {
    console.log({ action });

    const socket = new WebSocket(
      `ws://localhost:8080?username=${action.payload.username}`
    );

    socket.addEventListener("open", (event) => {});

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      const message = JSON.parse(event.data);

      if (message.type === "connected") {
        listenerApi.dispatch(
          connected({
            roomId: message.roomId,
          })
        );
      }

      if (message.type === "chat_message") {
        console.log(message);
        listenerApi.dispatch(
          chatMessage({
            message: message.message,
            username: message.username,
            userId: message.userId,
          })
        );
      }
    });

    // FIXME :(
    let lastChatMessage: string = "";

    while (
      await listenerApi.condition((action) => {
        if (sendChat.match(action)) {
          lastChatMessage = action.payload.message;
          return true;
        }

        return false;
      })
    ) {
      const data = {
        type: "chat_message",
        message: lastChatMessage,
      };

      socket.send(JSON.stringify(data));
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: joinRoom,
  effect: async (action, listenerApi) => {
    console.log({ action });

    const socket = new WebSocket(
      `ws://localhost:8080?username=${action.payload.username}&roomId=${action.payload.roomId}`
    );

    socket.addEventListener("open", (event) => {});

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      const message = JSON.parse(event.data);

      if (message.type === "connected") {
        listenerApi.dispatch(
          connected({
            roomId: message.roomId,
          })
        );
      }

      if (message.type === "chat_message") {
        console.log(message);
        listenerApi.dispatch(
          chatMessage({
            message: message.message,
            username: message.username,
            userId: message.userId,
          })
        );
      }
    });

    // FIXME :(
    let lastChatMessage: string = "";

    while (
      await listenerApi.condition((action) => {
        if (sendChat.match(action)) {
          lastChatMessage = action.payload.message;
          return true;
        }

        return false;
      })
    ) {
      const data = {
        type: "chat_message",
        message: lastChatMessage,
      };

      socket.send(JSON.stringify(data));
    }
  },
});

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
