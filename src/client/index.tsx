import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { App } from "./components/App";
import { Home } from "./components/Home";
import { Lobby } from "./components/Lobby";
import { SocketProvider } from "./context/SocketContext";

const app = document.getElementById("app");

if (!app) {
  throw Error("Undefined App element");
}

const root = createRoot(app);

root.render(
  <BrowserRouter>
    <App>
      <Routes>
        <Route
          path="/"
          element={
            <SocketProvider namespace="/home">
              <Home />
            </SocketProvider>
          }
        />
        <Route
          path="/game/:uuid"
          element={
            <SocketProvider namespace="/lobby">
              <Lobby />
            </SocketProvider>
          }
        />
      </Routes>
    </App>
  </BrowserRouter>,
);
