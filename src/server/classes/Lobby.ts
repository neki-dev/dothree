import utils from '../utils';
import Core from './Core';
import Player from './Player';
import World from './World';

import type WorldLocation from '~type/WorldLocation';
import LobbyOptions from '~type/LobbyOptions';
import LobbyInfo from '~type/LobbyInfo';
import PlayerInfo from '~type/PlayerInfo';

import CONFIG from '~root/config.json';
import WorldMap from '~type/WorldMap';

export default class Lobby {

    public readonly uuid: string;
    public options: LobbyOptions;
    private readonly date: Date;
    private readonly core: Core;
    private readonly world: World;
    private players: Player[] = [];
    private idleTick: number = 0;
    private reseting?: NodeJS.Timeout | null = null;
    private timeout: number = 0;

    private _step: number | null = null;
    public get step() {
        return this._step;
    }

    public set step(v: number | null) {
        this._step = v;
        this.emit('updateStep', v);
    }

    constructor(core: Core, options: LobbyOptions) {

        this.options = utils.validate(options, {
            maxPlayers: {default: 3, min: 2, max: 5},
            density: {default: 10, min: 0, max: 40},
            bonusing: {default: 2, min: 0, max: 5},
            timeout: {default: 30, min: 5, max: 60},
            targetLength: {default: 3, min: 3, max: 4},
        });

        this.core = core;
        this.uuid = utils.generate();
        this.date = new Date();

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

    emit(key: string, data: any): void {
        this.core.namespace('/lobby').to(this.uuid).emit(key, data);
    }

    onGameTick(): void {
        this.handleStepTimeout();
        if (CONFIG.LOBBY_IDLE_TIMEOUT > 0) {
            this.handleIdleTimeout();
        }
    }

    joinPlayer(player: Player): void {
        const isExists: boolean = this.players.some((p) => (p.id === player.id));
        if (isExists) {
            player.sendError('Вы уже находитесь в этой игре');
            return;
        }
        const slot: number = this.getFreeSlot();
        if (slot === null) {
            player.sendError('Указанная игра уже запущена');
            return;
        }
        player.joinLobby(this, slot);
        this.players.push(player);
        this.updateClientPlayers();
        if (!this.isStarted() && this.isFulled()) {
            this.start();
        }
        console.log(`Player #${player.id} joined to lobby #${this.uuid}`);
    }

    leavePlayer(player: Player): void {
        const index: number = this.players.findIndex((p) => (p.id === player.id));
        if (index === -1) {
            return console.warn(`Player #${player.id} not found in lobby #${this.uuid}`);
        }
        this.players.splice(index, 1);
        this.updateClientPlayers();
        player.leaveLobby(this);
        if (this.reseting) {
            this.reset();
        }
        console.log(`Player #${player.id} leaved from lobby #${this.uuid}`);
    }

    putEntity(player: Player, location: WorldLocation): void {
        if (this.step !== player.slot) {
            return;
        }
        const result: WorldLocation[] = this.world.place(player.slot, location);
        if (result) {
            const isWinning: boolean = this.world.checkWinning(result);
            if (isWinning) {
                this.finish();
                this.emit('playerWin', player.id);
            } else {
                this.moveStepToNextPlayer();
            }
            this.emit('updateWorldMap', this.world.map);
        }
    }

    getMap(): WorldMap {
        return this.world.map;
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

    private getFreeSlot(): number | null {
        for (let i = 0; i < this.options.maxPlayers; i++) {
            if (this.players.every((player) => (player.slot !== i))) {
                return i;
            }
        }
        return null;
    }

    private updateClientPlayers(): void {
        const players: PlayerInfo[] = this.players.map((player) => ({
            id: player.id,
            slot: player.slot,
        }));
        this.emit('updatePlayers', players);
        this.core.updateClientLobbies();
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
    }

    private reset(): void {
        if (this.reseting) {
            clearTimeout(this.reseting);
            this.reseting = null;
        }
        this.world.generate();
        this.emit('updateWorldMap', this.world.map);
        if (this.isFulled()) {
            this.start();
        }
    }

    private finish(): void {
        this.reseting = setTimeout(() => {
            this.reset();
        }, CONFIG.RESTART_TIMEOUT * 1000);
        this.step = null;
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
        }
    }

}