import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./pages/index.tsx";
import { Room } from "./old/room.tsx";
import { AppContextProvider } from "./old/AppContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/room",
    element: <Room />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </ChakraProvider>
);
