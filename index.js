const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const CONFIG = require('./config.json');
const PATH_TO_INDEX = path.join(__dirname, 'client', 'index.html');

const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use((req, res) => res.sendFile(PATH_TO_INDEX));

const port = process.env.PORT || CONFIG.PORT;
const server = http.Server(app);
server.listen(port, () => {
    console.log(`Game server listening on :${port}`);
});

const io = socket(server);
require('./lib/game')(io);