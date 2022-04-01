import { Server, Socket } from 'socket.io';
import Core from './classes/Core';
import { DEFAULT_OPTIONS } from './classes/Lobby';
import Player from './classes/Player';
import { WorldLocation } from '~type/World';
import { LobbyOptions } from '~type/Lobby';

import CONFIG from '~root/config.json';

export default {
  boot(io: Server): void {
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
        player.sendError('Указанная игра не найдена');
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
  },
};
