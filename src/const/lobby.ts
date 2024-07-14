import type { LobbyOptions } from '~type/lobby';

export const DEFAULT_OPTIONS: LobbyOptions = {
  maxPlayers: 3,
  density: 1,
  bonusing: 2,
  timeout: 30,
  moveMap: false,
  useBonuses: true,
};
