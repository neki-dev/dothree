import { DEFAULT_OPTIONS } from '~class/Lobby';
import { PlayerInfo } from '~type/Player';

import { socket } from '~test';

const player: PlayerInfo = {
  id: socket.id,
  slot: 0,
};

export default {
  players: [player],
  options: DEFAULT_OPTIONS,
};
