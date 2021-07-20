import {Namespace, Server} from 'socket.io';

import Lobby from './Lobby';

interface LastLobby {
    uuid: string,
    date: Date,
    players: {
        online: number,
        max: number,
    },
}

class Core {

    private readonly io: Server;
    private readonly lobbies: Array<Lobby>;

    constructor(io: Server) {
        this.io = io;
        this.lobbies = [];
    }

    initialize(): void {
        setInterval(() => {
            for (const lobby of this.lobbies) {
                lobby.onGameTick();
            }
        }, 1000);
    }

    namespace(name: string): Namespace {
        return this.io.of(name);
    }

    send(key: string, data: any): void {
        this.namespace('/home').emit(`player:${key}`, data);
    }

    getLobby(uuid: string): Lobby | undefined {
        return this.lobbies.find((lobby) => (lobby.uuid === uuid));
    }

    addLobby(lobby: Lobby): void {
        this.lobbies.push(lobby);
        this.updateLobbies();
    }

    removeLobby(lobby: Lobby): void {
        const index = this.lobbies.findIndex((l) => (l.uuid === lobby.uuid));
        if (index === -1) {
            console.warn(`Lobby #${lobby.uuid} is not found`);
            return;
        }
        this.lobbies.splice(index, 1);
        this.updateLobbies();
    }

    getLastLobbies(limit: number = 5): Array<LastLobby> {
        const freeLobbies = this.lobbies.filter((lobby) => (lobby.players.length < lobby.options.maxPlayers)).sort((a: Lobby, b: Lobby) => (
            (a.date.getTime() - b.date.getTime())
        ));
        return freeLobbies.slice(0, limit).map((lobby: Lobby) => ({
            uuid: lobby.uuid,
            date: lobby.date,
            players: {
                online: lobby.players.length,
                max: lobby.options.maxPlayers,
            },
        }));
    }

    updateLobbies(): void {
        const lobbies = this.getLastLobbies();
        this.send('UpdateLobbies', lobbies);
    }

}

export default Core;