import {Server, Socket} from 'socket.io';
import Core from './classes/Core';
import Player from './classes/Player';
import Lobby from './classes/Lobby';

import type WorldLocation from '~type/WorldLocation';
import LobbyOptions from '~type/LobbyOptions';
import LobbyInfo from '~type/LobbyInfo';

export default {
    boot(io: Server): void {

        const core = new Core(io);
        core.initialize();

        core.namespace('/home').on('connection', (socket: Socket) => {
            const lobbies: LobbyInfo[] = core.getLastLobbies();
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
            const player: Player = new Player(socket);
            const lobby: Lobby = core.getLobby(<string>socket.handshake.query.uuid);
            if (!lobby) {
                return player.send('Error', 'Указанная игра не найдена');
            }
            lobby.joinPlayer(player);
            socket.on('disconnect', () => {
                lobby.leavePlayer(player);
            });
            socket.on('player:PutEntity', (location: WorldLocation) => {
                lobby.putEntity(player, location);
            });
        });

    },
};