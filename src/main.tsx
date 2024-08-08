import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./pages/index.tsx";
import { Room } from "./pages/room.tsx";
import { AppContextProvider } from "./components/utility/AppContext.tsx";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/room/:id",
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
