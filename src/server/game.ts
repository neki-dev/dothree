import {Server, Socket} from 'socket.io';
import Core from './classes/Core';
import Player from './classes/Player';
import Lobby from './classes/Lobby';

import type Location from '~t/Location';
import LobbyOptions from '~t/LobbyOptions';

export default {
    boot(io: Server): void {

        const core = new Core(io);
        core.initialize();

        core.namespace('/home').on('connection', (socket: Socket) => {
            const lobbies = core.getLastLobbies();
            socket.emit('player:UpdateLobbies', lobbies);
            socket.on('player:CreateLobby', (data: LobbyOptions) => {
                const lobby = new Lobby(core, data);
                core.addLobby(lobby);
                socket.emit('player:InviteLobby', lobby.uuid);
            });
        });

        core.namespace('/lobby').on('connection', (socket: Socket) => {
            if (!socket.handshake.query.uuid) {
                return;
            }
            const player = new Player(socket);
            const lobby = core.getLobby(<string>socket.handshake.query.uuid);
            if (!lobby) {
                return player.send('Error', 'Указанная игра не найдена');
            }
            lobby.joinPlayer(player);
            socket.on('disconnect', () => {
                lobby.leavePlayer(player);
            });
            socket.on('player:PutEntity', (location: Location) => {
                lobby.putEntity(player, location);
            });
        });

    },
};