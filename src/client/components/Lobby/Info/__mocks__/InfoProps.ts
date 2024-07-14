import { DEFAULT_OPTIONS } from '~const/lobby';
import type { PlayerInfo } from '~type/player';

import { socket } from '~test';

const player: PlayerInfo = {
  id: socket.id,
  slot: 0,
};

export default {
  players: [player],
  options: DEFAULT_OPTIONS,
};
