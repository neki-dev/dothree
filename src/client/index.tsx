import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppWrapper } from "./components/app-wrapper";
import { HomePage } from "./pages/home";
import { LobbyPage } from "./pages/lobby";
import { SocketProvider } from "./socket/socket-provider";

const app = document.getElementById("app");

if (!app) {
  throw Error("Undefined App element");
}

const root = createRoot(app);

root.render(
  <BrowserRouter>
    <AppWrapper>
      <Routes>
        <Route
          path="/"
          element={
            <SocketProvider namespace="/home">
              <HomePage />
            </SocketProvider>
          }
        />
        <Route
          path="/game/:uuid"
          element={
            <SocketProvider namespace="/lobby">
              <LobbyPage />
            </SocketProvider>
          }
        />
      </Routes>
    </AppWrapper>
  </BrowserRouter>,
);
