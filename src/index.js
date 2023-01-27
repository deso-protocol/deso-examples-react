import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Home } from "./routes/home";
import { Root } from "./routes/root";
import { SignAndSubmitTx } from "./routes/sign-and-submit-tx";
import { SwitchAccount } from "./routes/switch-account";
import { User } from "./routes/user";

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
