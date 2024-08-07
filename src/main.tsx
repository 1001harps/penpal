import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "./pages/index.tsx";
import { Room } from "./pages/room.tsx";
import { AppContextProvider } from "./components/utility/AppContext.tsx";

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
