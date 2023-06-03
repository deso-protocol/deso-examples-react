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
import { MantineProvider } from "@mantine/core";
import { Wave } from "./routes/wave";
import { User } from "./routes/user";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

import { DeSoIdentityProvider } from "react-deso-protocol";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "f8ceedee-51e6-4717-99a8-bf4dbcb202de",
  }),
});

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
    <LivepeerConfig client={livepeerClient}>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <DeSoIdentityProvider>
          <RouterProvider router={router} />
        </DeSoIdentityProvider>
      </MantineProvider>
    </LivepeerConfig>
  </React.StrictMode>
);
