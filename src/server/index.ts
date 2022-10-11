import { createServer } from 'http';
import path from 'path';

import express from 'express';
import log from 'loglevel';
import { Server as SocketServer } from 'socket.io';

import CONFIG from '~root/config.json';

import { boot } from './game';

const PATH_TO_INDEX = path.join(__dirname, '..', 'app', 'index.html');

log.setLevel('debug');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'app')));
app.get(['/', '/game/:uuid'], (_, res) => {
  res.sendFile(PATH_TO_INDEX);
});

app.get('/handshake', (_, res) => {
  res.send('OK');
});

const port = Number(process.env.PORT) || CONFIG.PORT;
const server = createServer(app);
server.listen(port, () => {
  log.info(`Game server listening on http://127.0.0.1:${port}`);
});

const io = new SocketServer(server);
boot(io);
