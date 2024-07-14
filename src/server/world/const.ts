import type { WorldLocation } from "~/shared/world/types";

export const WORLD_MAP_SIZE = [25, 11];

export const WORLD_CHAIN_TARGET_LENGTH = 3;

export const WORLD_DIRECTIONS: WorldLocation[] = [
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
