import { createContext } from 'react';

import type { WorldMap } from '~type/world';

export const WorldContext = createContext<WorldMap>([]);
