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
						socket.emit('updateLatestLobbies', lobbies);
						socket.on('createLobby', (data: LobbyOptions, callback: Function) => {
								const lobby = new Lobby(core, data);
								core.addLobby(lobby);
								callback(lobby.uuid);
						});
				});

				core.namespace('/lobby').on('connection', (socket: Socket) => {
						const uuid: string = <string>socket.handshake.query.uuid;
						if (!uuid) {
								return;
						}
						const player: Player = new Player(socket);
						const lobby: Lobby = core.getLobby(uuid);
						if (!lobby) {
								player.sendError('Указанная игра не найдена');
								return;
						}
						lobby.joinPlayer(player);
						socket.on('putEntity', (location: WorldLocation) => {
								lobby.putEntity(player, location);
						});
						socket.on('disconnect', () => {
								lobby.leavePlayer(player);
						});
				});

		},
};