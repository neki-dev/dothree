import { LobbyEvent } from "~/shared/lobby/types";

import type { Socket } from "socket.io";

export class Player {
  private readonly socket: Socket;

  public readonly id: string;

  public slot: Nullable<number> = null;

  constructor(socket: Socket) {
    this.socket = socket;
    this.id = socket.id;
  }

  public emit(key: string, data?: any): void {
    this.socket.emit(key, data);
  }

  public emitError(message: string): void {
    this.socket.emit(LobbyEvent.Error, message);
  }

  public join(uuid: string, slot: number): void {
    this.slot = slot;
    this.socket.join(uuid);
  }

  public leave(uuid: string): void {
    this.slot = null;
    this.socket.leave(uuid);
  }
}
