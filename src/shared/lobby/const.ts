import type { LobbyOptions } from "~/shared/lobby/types";

export const LOBBY_RESTART_TIMEOUT = 5;

export const LOBBY_IDLE_TIMEOUT = 60;

export const LOBBY_DEFAULT_OPTIONS: LobbyOptions = {
  maxPlayers: 3,
  density: 1,
  bonusing: 2,
  timeout: 30,
  moveMap: false,
  useBonuses: true,
};
