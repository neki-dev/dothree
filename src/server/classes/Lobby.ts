import log from 'loglevel';
import { Namespace } from 'socket.io';

import { generateUUID } from '../utils';
import CONFIG from '~root/config.json';
import { LobbyOptions, LobbyInfo, LobbyEvent } from '~type/lobby';
import { PlayerInfo } from '~type/player';
import { WorldLocation, WorldMap } from '~type/world';

import { Player } from './Player';
import { World } from './World';

type LobbyParameters = {
  namespace: () => Namespace
  onDestroy?: () => void
};

export class Lobby {
  public readonly uuid: string;

  public readonly options: LobbyOptions;

  private readonly parameters: LobbyParameters;

  private readonly date: Date;

  private readonly world: World;

  private players: Player[] = [];

  private idleTick: number = 0;

  private reseting?: Nullable<NodeJS.Timeout> = null;

  private _step: Nullable<number> = null;

  public get step() {
    return this._step;
  }

  public set step(step: number | null) {
    this._step = step;
    this.emit(LobbyEvent.UpdateStep, step);
  }

  private _timeout: number = 0;

  public get timeout() {
    return this._timeout;
  }

  public set timeout(v: number) {
    this._timeout = v;
    this.emit(LobbyEvent.UpdateTimeout, v);
  }

  constructor(options: LobbyOptions, parameters: LobbyParameters) {
    this.options = options;
    this.parameters = parameters;

    this.uuid = generateUUID();
    this.date = new Date();
    this.world = new World(this.options);
    this.world.generateMap();

    log.info(`Lobby #${this.uuid} created`);
  }

  emit(key: string, data?: any): void {
    const { namespace } = this.parameters;

    namespace().to(this.uuid).emit(key, data);
  }

  onGameTick(): void {
    this.handleStepTimeout();

    if (CONFIG.LOBBY_IDLE_TIMEOUT > 0) {
      this.handleIdleTimeout();
    }
  }

  joinPlayer(player: Player): void {
    const isExists = this.players.some((p) => p.id === player.id);

    if (isExists) {
      player.emitError('You are already in this lobby');

      return;
    }

    const slot = this.getFreeSlot();

    if (slot === null) {
      player.emitError('This lobby is already started');

      return;
    }

    player.join(this.uuid, slot);
    player.emit(LobbyEvent.SendOptions, this.options);
    player.emit(LobbyEvent.UpdateWorldMap, this.getMap());
    player.emit(LobbyEvent.UpdateStep, this.step);

    this.players.push(player);
    this.updateClientPlayers();

    if (!this.isStarted() && this.isFulled()) {
      this.start();
    }

    log.info(`Player #${player.id} joined to lobby #${this.uuid}`);
  }

  leavePlayer(player: Player): void {
    const index = this.findPlayerIndex(player);

    if (index === -1) {
      log.warn(`Player #${player.id} not found in lobby #${this.uuid}`);

      return;
    }

    this.players.splice(index, 1);
    this.updateClientPlayers();

    player.leave(this.uuid);

    if (this.reseting) {
      this.reset();
    }

    log.info(`Player #${player.id} leaved from lobby #${this.uuid}`);
  }

  putEntity(player: Player, location: WorldLocation): void {
    if (this.step === null || this.step !== player.slot) {
      return;
    }

    const result = this.world.place(player.slot, location);

    if (result) {
      const isWinning = this.world.checkWinning(result);

      if (isWinning) {
        this.finish();
        this.emit(LobbyEvent.PlayerWin, player.id);
      } else {
        this.moveStepToNextPlayer();
      }

      this.emit(LobbyEvent.UpdateWorldMap, this.world.map);
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
    return this.step !== null;
  }

  isFulled(): boolean {
    return this.players.length === this.options.maxPlayers;
  }

  private destroy(): void {
    const { onDestroy } = this.parameters;

    if (onDestroy) {
      onDestroy();
    }

    if (this.reseting !== null) {
      clearTimeout(this.reseting);
    }

    log.info(`Lobby #${this.uuid} destroyed`);
  }

  private findPlayerIndex(player: Player): number {
    return this.players.findIndex((p) => p.id === player.id);
  }

  private getFreeSlot(): number | null {
    for (let i = 0; i < this.options.maxPlayers; i += 1) {
      if (this.players.every((player) => player.slot !== i)) {
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

    this.emit(LobbyEvent.UpdatePlayers, players);
  }

  private moveStepToNextPlayer(): void {
    this.resetTimeout();
    if (this.step !== null) {
      if (this.step + 1 === this.options.maxPlayers) {
        this.step = 0;
      } else {
        this.step++;
      }
    }

    if (this.options.moveMap) {
      this.world.moveMap();
    }
  }

  private resetTimeout(): void {
    this.timeout = this.options.timeout;
  }

  private start(): void {
    this.timeout = this.options.timeout;
    this.step = Math.floor(Math.random() * this.options.maxPlayers);
  }

  private reset(): void {
    this.emit(LobbyEvent.ClearWinner);

    if (this.reseting) {
      clearTimeout(this.reseting);
      this.reseting = null;
    }

    this.world.generateMap();
    this.emit(LobbyEvent.UpdateWorldMap, this.world.map);

    if (this.isFulled()) {
      this.start();
    }
  }

  private finish(): void {
    this.reseting = setTimeout(() => {
      this.reset();
    }, CONFIG.LOBBY_RESTART_TIMEOUT * 1000);
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
