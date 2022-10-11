import { createServer } from 'http';
import path from 'path';

import express, { Express } from 'express';
import log from 'loglevel';
import { Server as SocketServer } from 'socket.io';

import CONFIG from '~root/config.json';

import { boot } from './game';

const PATH_TO_INDEX: string = path.join(__dirname, '..', 'app', 'index.html');

log.setLevel('debug');

const app: Express = express();
app.use(express.static(path.join(__dirname, '..', 'app')));
app.get(['/', '/game/:uuid'], (req: express.Request, res: express.Response) => res.sendFile(PATH_TO_INDEX));

const port: number = Number(process.env.PORT) || CONFIG.PORT;
const server = createServer(app);
server.listen(port, () => {
  log.info(`Game server listening on http://127.0.0.1:${port}`);
});

const io = new SocketServer(server);
boot(io);
