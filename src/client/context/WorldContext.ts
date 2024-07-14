import { createContext } from "react";

import type { WorldMap } from "~/shared/world/types";

export const WorldContext = createContext<WorldMap>([]);
