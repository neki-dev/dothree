import {Socket} from 'socket.io';
import Lobby from './Lobby';

import CONFIG from '~root/config.json';

class Player {

    private readonly socket: Socket;
    public readonly id: string;
    public slot?: number;

    constructor(socket: Socket) {
        this.socket = socket;
        this.id = CONFIG.IP_ONCE ? socket.handshake.address : socket.id;
        this.slot = null;
    }

    emit(key: string, data: any): void {
        this.socket.emit(key, data);
    }

    sendError(message: string): void {
        this.socket.emit(`lobbyError`, message);
    }

    joinLobby(lobby: Lobby, slot: number): void {
        this.slot = slot;
        this.socket.join(lobby.uuid);
        this.emit('sendOptions', lobby.options);
        this.emit('updateWorldMap', lobby.getMap());
        this.emit('updateStep', lobby.step);
    }

    leaveLobby(lobby: Lobby): void {
        this.slot = null;
        this.socket.leave(lobby.uuid);
    }

}

export default Player;