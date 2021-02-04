const Core = require('./classes/Core');
const Player = require('./classes/Player');
const Lobby = require('./classes/Lobby');

module.exports = (io) => {

    const core = new Core(io);
    core.initialize();

    io.of('/home').on('connection', (socket) => {

        // Список последних созданых лобби
        const lobbies = core.getLastLobbies();
        socket.emit('player:UpdateLobbies', lobbies);

        // Создание нового лобби
        socket.on('player:CreateLobby', (data) => {
            const lobby = new Lobby(core, data);
            core.addLobby(lobby);
            socket.emit('player:InviteLobby', lobby.uuid);
        });

    });

    io.of('/lobby').on('connection', (socket) => {

        if (!socket.handshake.query.uuid) {
            return;
        }

        const player = new Player(socket);

        const lobby = core.getLobby(socket.handshake.query.uuid);
        if (!lobby) {
            return player.send('Error', 'Указанная игра не найдена');
        }

        lobby.joinPlayer(player);
        socket.on('disconnect', () => {
            lobby.leavePlayer(player);
        });

        // Ход игрока
        socket.on('player:PutEntity', (location) => {
            lobby.putEntity(player, location);
        });

    });
    
};