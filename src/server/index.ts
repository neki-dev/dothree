import {createServer} from 'http';
import path from 'path';
import express, {Express} from 'express';
import {Server as SocketServer} from 'socket.io';
import game from './game';

import CONFIG from '~root/config.json';

const PATH_TO_INDEX: string = path.join(__dirname, '..', 'app', 'index.html');

const app: Express = express();
app.use(express.static(path.join(__dirname, '..', 'app')));
app.get(['/', '/game/:uuid'], (req: express.Request, res: express.Response) => {
    return res.sendFile(PATH_TO_INDEX);
});

const port: number = Number(process.env.PORT) || CONFIG.PORT;
const server = createServer(app);
server.listen(port, () => {
    console.log(`Game server listening on :${port}`);
});

const io = new SocketServer(server);
game.boot(io);