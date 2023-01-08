import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import App from "App";
import { LoginPage, NotFoundPage, RegisterPage } from "pages";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/canvas", element: <App /> },
  { path: "/er-diagrams", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider>
  </MantineProvider>
);
