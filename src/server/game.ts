import { Core } from "./core";
import { Player } from "./player";
import { LOBBY_DEFAULT_OPTIONS } from "~/shared/lobby/const";
import type { LobbyOptions } from "~/shared/lobby/types";
import { LobbyEvent } from "~/shared/lobby/types";
import type { WorldLocation } from "~/shared/world/types";

import type { Server, Socket } from "socket.io";

import CONFIG from "~/../config.json";

export function boot(io: Server): void {
  const core = new Core(io);

  core.initialize();

  if (CONFIG.MOCKED_LOBBY) {
    core.createLobby(LOBBY_DEFAULT_OPTIONS);
  }

  core.namespace("/home").on("connection", (socket: Socket) => {
    core.updateClientLatestLobbies();

    socket.on(
      LobbyEvent.CreateLobby,
      (data: LobbyOptions, callback: (uuid: string) => void) => {
        const { uuid } = core.createLobby(data);

        callback(uuid);
      },
    );
  });

  core.namespace("/lobby").on("connection", (socket: Socket) => {
    const uuid = <string>socket.handshake.query.uuid;

    if (!uuid) {
      return;
    }

    const player = new Player(socket);
    const lobby = core.findLobby(uuid);

    if (!lobby) {
      player.emitError("Lobby is not found");

      return;
    }

    lobby.joinPlayer(player);
    core.updateClientLatestLobbies();

    socket.on(LobbyEvent.PutEntity, (location: WorldLocation) => {
      lobby.putEntity(player, location);
    });

    socket.on("disconnect", () => {
      lobby.leavePlayer(player);
      core.updateClientLatestLobbies();
    });
  });
}
