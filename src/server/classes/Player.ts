import { Socket } from 'socket.io';

import CONFIG from '~root/config.json';
import { LobbyEvent } from '~type/lobby';

export class Player {
  private readonly socket: Socket;

  public readonly id: string;

  public slot?: number;

  constructor(socket: Socket) {
    this.socket = socket;
    this.id = CONFIG.IP_ONCE ? socket.handshake.address : socket.id;
    this.slot = null;
  }

  emit(key: string, data?: any): void {
    this.socket.emit(key, data);
  }

  emitError(message: string): void {
    this.socket.emit(LobbyEvent.Error, message);
  }

  join(uuid: string, slot: number): void {
    this.slot = slot;
    this.socket.join(uuid);
  }

  leave(uuid: string): void {
    this.slot = null;
    this.socket.leave(uuid);
  }
}
