import utils from '../utils';
import Core from './Core';
import Player from './Player';
import World from './World';

import type WorldLocation from '~type/WorldLocation';
import LobbyInfo from '~type/LobbyInfo';
import LobbyOptions from '~type/LobbyOptions';

import CONFIG from '~root/config.json';

class Lobby {

	public readonly uuid: string;
	public options: LobbyOptions;
	public players: Array<Player>;
	private readonly date: Date;
	private readonly core: Core;
	private readonly world: World;
	private idleTick: number;
	private reseting?: NodeJS.Timeout | null;
	private step?: number;
	private timeout: number;

	constructor(core: Core, options: LobbyOptions = {}) {

		this.options = utils.validate(options, {
			maxPlayers: {default: 3, min: 2, max: 5},
			density: {default: 10, min: 0, max: 40},
			bonusing: {default: 2, min: 0, max: 5},
			timeout: {default: 30, min: 5, max: 60},
			targetLength: {default: 3, min: 3, max: 4},
		});

		this.uuid = utils.generate();
		this.players = [];
		this.step = null;
		this.timeout = 0;
		this.date = new Date();
		this.reseting = null;
		this.core = core;
		this.idleTick = 0;

		this.world = new World(this.options);
		this.world.generate();

		console.log(`Lobby #${this.uuid} created`);

	}

	destroy(): void {
		this.core.removeLobby(this);
		if (this.reseting !== null) {
			clearTimeout(this.reseting);
		}
		console.log(`Lobby #${this.uuid} destroyed`);
	}

	send(key: string, data: any): void {
		this.core.namespace('/lobby').to(this.uuid).emit(`lobby:${key}`, data);
	}

	onGameTick(): void {
		this.handleStepTimeout();
		if (CONFIG.LOBBY_IDLE_TIMEOUT > 0) {
			this.handleIdleTimeout();
		}
	}

	getFreeSlot(): number | null {
		for (let i = 0; i < this.options.maxPlayers; i++) {
			if (this.players.every((player) => (player.slot !== i))) {
				return i;
			}
		}
		return null;
	}

	joinPlayer(player: Player): void {
		const isExists = this.players.some((p) => (p.id === player.id));
		if (isExists) {
			return player.send('Error', 'Вы уже находитесь в этой игре');
		}
		const slot = this.getFreeSlot();
		if (slot === undefined) {
			return player.send('Error', 'Указанная игра уже запущена');
		}
		player.join(this.uuid, slot);
		player.send('JoinLobby', {
			world: this.world.map,
			step: this.step,
			timeout: this.timeout,
			options: this.options,
		});
		this.players.push(player);
		this.updateClientPlayers();
		if (!this.isStarted() && this.isFulled()) {
			this.start();
		}
		console.log(`Player #${player.id} joined to lobby #${this.uuid}`);
	}

	leavePlayer(player: Player): void {
		const index = this.players.findIndex((p) => (p.id === player.id));
		if (index === -1) {
			return console.warn(`Player #${player.id} not found in lobby #${this.uuid}`);
		}
		this.players.splice(index, 1);
		this.updateClientPlayers();
		player.leave(this.uuid);
		if (this.reseting) {
			this.reset();
		}
		console.log(`Player #${player.id} leaved from lobby #${this.uuid}`);
	}

	putEntity(player: Player, location: WorldLocation): void {

		if (this.step !== player.slot) {
			return;
		}

		const result = this.world.place(player.slot, location);
		if (!result) {
			return;
		}

		const isWinning = this.world.checkWinning(result);
		if (isWinning) {
			this.send('PlayerWin', player.id);
			this.finish();
		} else {
			this.moveStepToNextPlayer();
		}

		this.updateClientMeta();
		this.updateClientWorld();

	}

	getInfo(): LobbyInfo {
		return {
			uuid: this.uuid,
			date: this.date,
			players: {
				online: this.players.length,
				max: this.options.maxPlayers,
			},
		};
	}

	isStarted(): boolean {
		return (this.step !== null);
	}

	isFulled(): boolean {
		return (this.players.length === this.options.maxPlayers);
	}

	private updateClientPlayers(): void {
		const players = this.players.map((player) => ({
			id: player.id,
			slot: player.slot,
		}));
		this.send('UpdatePlayers', players);
		this.core.updateClientLobbies();
	}

	private updateClientMeta(): void {
		this.send('UpdateMeta', {
			step: this.step,
			timeout: this.timeout,
		});
	}

	private updateClientWorld(): void {
		this.send('UpdateWorld', this.world.map);
	}

	private moveStepToNextPlayer(): void {
		this.timeout = this.options.timeout;
		if (this.step + 1 === this.options.maxPlayers) {
			this.step = 0;
		} else {
			this.step++;
		}
	}

	private start(): void {
		this.timeout = this.options.timeout;
		this.step = Math.floor(Math.random() * this.options.maxPlayers);
		this.updateClientMeta();
	}

	private reset(): void {
		if (this.reseting) {
			clearTimeout(this.reseting);
			this.reseting = null;
		}
		this.world.generate();
		this.updateClientWorld();
		if (this.isFulled()) {
			this.start();
		}
	}

	private finish(): void {
		this.step = null;
		this.reseting = setTimeout(() => {
			this.reset();
		}, CONFIG.RESTART_TIMEOUT * 1000);
	}

	private handleIdleTimeout(): void {
		if (this.players.length === 0) {
			this.idleTick++;
			if (this.idleTick === CONFIG.LOBBY_IDLE_TIMEOUT) {
				this.destroy();
			}
		} else {
			this.idleTick = 0;
		}
	}

	private handleStepTimeout(): void {
		if (this.isStarted() && this.isFulled()) {
			this.timeout--;
			if (this.timeout === 0) {
				this.moveStepToNextPlayer();
			}
			this.updateClientMeta();
		}
	}

}

export default Lobby;
export {LobbyOptions};