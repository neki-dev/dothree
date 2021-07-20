import {createServer} from 'http';
import path from 'path';
import express from 'express';
import {Server as SocketServer} from 'socket.io';
import game from './game';

const CONFIG = require('../../config.json');
const PATH_TO_INDEX: string = path.join(__dirname, '..', 'app', 'index.html');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'app')));
app.get(['/', '/game/:uuid'], (req: express.Request, res: express.Response) => {
    return res.sendFile(PATH_TO_INDEX);
});

const port: number = process.env.PORT || CONFIG.PORT;
const server = createServer(app);
server.listen(port, () => {
    console.log(`Game server listening on :${port}`);
});

const io = new SocketServer(server);
game.boot(io);