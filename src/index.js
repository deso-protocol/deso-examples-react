import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/home";
import { Root } from "./routes/root";
import { Profile } from "./routes/profile";
import { NotificationsPage } from "./routes/notifications";
import { Discover } from "./routes/discover";
import { Wallet } from "./routes/wallet";
import { Settings } from "./routes/settings";
import { SignAndSubmitTx } from "./routes/sign-and-submit-tx";
import { SwitchAccount } from "./routes/switch-account";
import { Wave } from "./routes/wave";
import { User } from "./routes/user";
import { MantineProvider } from "@mantine/core";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/u/:username",
        element: <User />,
      },
      {
        path: "/sign-and-submit-tx",
        element: <SignAndSubmitTx />,
      },
      {
        path: "/switch-account",
        element: <SwitchAccount />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/discover",
        element: <Discover />,
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/wave/:username",
        element: <Wave />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
