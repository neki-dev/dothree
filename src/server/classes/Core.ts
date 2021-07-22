import {Namespace, Server} from 'socket.io';
import Lobby from './Lobby';

import LobbyInfo from '~type/LobbyInfo';

class Core {

		private readonly io: Server;
		private readonly lobbies: Lobby[];

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
				this.updateClientLobbies();
		}

		removeLobby(lobby: Lobby): void {
				const index: number = this.lobbies.findIndex((l) => (l.uuid === lobby.uuid));
				if (index === -1) {
						console.warn(`Lobby #${lobby.uuid} is not found`);
						return;
				}
				this.lobbies.splice(index, 1);
				this.updateClientLobbies();
		}

		getLastLobbies(limit: number = 5): LobbyInfo[] {
				return this.lobbies.filter((lobby) => !lobby.isFulled())
						.reverse()
						.slice(0, limit)
						.map((lobby: Lobby) => lobby.getInfo());
		}

		updateClientLobbies(): void {
				const lobbies: LobbyInfo[] = this.getLastLobbies();
				this.send('updateLatestLobbies', lobbies);
		}

}

export default Core;