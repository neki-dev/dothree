import { createContext } from 'react';
import { WorldMap } from '~type/World';

// eslint-disable-next-line import/prefer-default-export
export const WorldContext = createContext<WorldMap>([]);
