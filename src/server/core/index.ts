import console from "console";

import { Lobby } from "../lobby";
import type { LobbyOptions, LobbyInfo } from "~/shared/lobby/types";
import { LobbyEvent } from "~/shared/lobby/types";

import type { Namespace, Server } from "socket.io";

export class Core {
  private readonly io: Server;

  private readonly lobbies: Lobby[];

  constructor(io: Server) {
    this.io = io;
    this.lobbies = [];
  }

  public initialize(): void {
    setInterval(() => {
      this.lobbies.forEach((lobby) => {
        lobby.onGameTick();
      });
    }, 1000);
  }

  public namespace(name: string): Namespace {
    return this.io.of(name);
  }

  public createLobby(options: LobbyOptions): Lobby {
    const lobby = new Lobby(options, {
      namespace: () => this.namespace("/lobby"),
      onDestroy: () => {
        this.removeLobby(lobby);
      },
    });

    this.addLobby(lobby);

    return lobby;
  }

  public findLobby(uuid: string): Lobby | undefined {
    return this.lobbies.find((lobby) => lobby.uuid === uuid);
  }

  public addLobby(lobby: Lobby): void {
    this.lobbies.push(lobby);
    this.updateClientLatestLobbies();
  }

  public removeLobby(lobby: Lobby): void {
    const index = this.findLobbyIndex(lobby);

    if (index === -1) {
      console.warn(`Lobby #${lobby.uuid} is not found`);

      return;
    }

    this.lobbies.splice(index, 1);
    this.updateClientLatestLobbies();
  }

  public updateClientLatestLobbies(): void {
    const lobbies = this.getLastLobbies();

    this.namespace("/home").emit(LobbyEvent.UpdateLatestLobbies, lobbies);
  }

  private findLobbyIndex(lobby: Lobby): number {
    return this.lobbies.findIndex((l) => l.uuid === lobby.uuid);
  }

  private getLastLobbies(limit: number = 5): LobbyInfo[] {
    return this.lobbies
      .filter((lobby: Lobby) => !lobby.isFulled())
      .reverse()
      .slice(0, limit)
      .map((lobby: Lobby) => lobby.getInfo());
  }
}
