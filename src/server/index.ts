import { createServer } from 'http';
import path from 'path';

import express from 'express';
import log from 'loglevel';
import { Server as SocketServer } from 'socket.io';

import CONFIG from '~root/config.json';

import { boot } from './game';

const PUBLIC_PATH = path.join(__dirname, 'public');

log.setLevel('debug');

const app = express();
app.use(express.static(PUBLIC_PATH));
app.get(['/', '/game/:uuid'], (_, res) => {
  res.sendFile(path.join(PUBLIC_PATH, 'index.html'));
});

const port = Number(process.env.PORT) || CONFIG.PORT;
const server = createServer(app);
server.listen(port, () => {
  log.info(`Game server listening on http://localhost:${port}`);
});

const io = new SocketServer(server);
boot(io);
