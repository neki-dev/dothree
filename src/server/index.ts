import express from "express";
import { createServer } from "http";
import log from "loglevel";
import path from "path";
import { Server as SocketServer } from "socket.io";

import { boot } from "./game";

import CONFIG from "~/../config.json";

const PUBLIC_PATH = path.join(__dirname, "public");

log.setLevel("debug");

// Configure Express application

const app = express();

app.use(express.static(PUBLIC_PATH));
app.get(["/", "/game/:uuid"], (_, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

// Configure server

const port = Number(process.env.PORT) || CONFIG.PORT;
const server = createServer(app);

server.listen(port, () => {
  log.info(`Game server listening on http://localhost:${port}`);
});

const io = new SocketServer(server);

// Boot game processes

boot(io);
