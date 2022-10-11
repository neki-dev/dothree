import { Server, Socket } from 'socket.io';

import CONFIG from '~root/config.json';
import { LobbyOptions } from '~type/Lobby';
import { WorldLocation } from '~type/World';

import { Core } from './classes/Core';
import { DEFAULT_OPTIONS } from './classes/Lobby';
import { Player } from './classes/Player';

export function boot(io: Server): void {
  const core = new Core(io);
  core.initialize();

  if (CONFIG.MOCKED_LOBBY) {
    core.createLobby(DEFAULT_OPTIONS);
  }

  core.namespace('/home').on('connection', (socket: Socket) => {
    core.updateClientLatestLobbies();

    socket.on('createLobby', (data: LobbyOptions, callback: (uuid: string) => void) => {
      const { uuid } = core.createLobby(data);
      callback(uuid);
    });
  });

  core.namespace('/lobby').on('connection', (socket: Socket) => {
    const uuid = <string>socket.handshake.query.uuid;
    if (!uuid) {
      return;
    }

    const player = new Player(socket);
    const lobby = core.findLobby(uuid);
    if (!lobby) {
      player.sendError('Lobby is not found');
      return;
    }

    lobby.joinPlayer(player);
    core.updateClientLatestLobbies();

    socket.on('putEntity', (location: WorldLocation) => {
      lobby.putEntity(player, location);
    });

    socket.on('disconnect', () => {
      lobby.leavePlayer(player);
      core.updateClientLatestLobbies();
    });
  });
}
