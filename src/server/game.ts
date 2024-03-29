import { Server, Socket } from 'socket.io';

import { DEFAULT_OPTIONS } from '~const/lobby';
import CONFIG from '~root/config.json';
import { LobbyEvent, LobbyOptions } from '~type/lobby';
import { WorldLocation } from '~type/world';

import { Core } from './classes/Core';
import { Player } from './classes/Player';

export function boot(io: Server): void {
  const core = new Core(io);

  core.initialize();

  if (CONFIG.MOCKED_LOBBY) {
    core.createLobby(DEFAULT_OPTIONS);
  }

  core.namespace('/home').on('connection', (socket: Socket) => {
    core.updateClientLatestLobbies();

    socket.on(
      LobbyEvent.CreateLobby,
      (data: LobbyOptions, callback: (uuid: string) => void) => {
        const { uuid } = core.createLobby(data);

        callback(uuid);
      },
    );
  });

  core.namespace('/lobby').on('connection', (socket: Socket) => {
    const uuid = <string>socket.handshake.query.uuid;

    if (!uuid) {
      return;
    }

    const player = new Player(socket);
    const lobby = core.findLobby(uuid);

    if (!lobby) {
      player.emitError('Lobby is not found');

      return;
    }

    lobby.joinPlayer(player);
    core.updateClientLatestLobbies();

    socket.on(LobbyEvent.PutEntity, (location: WorldLocation) => {
      lobby.putEntity(player, location);
    });

    socket.on('disconnect', () => {
      lobby.leavePlayer(player);
      core.updateClientLatestLobbies();
    });
  });
}
