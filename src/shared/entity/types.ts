export enum EntityType {
  BLOCK = "block",
  PLAYER = "player",
  EMPTY = "empty",
  BONUS = "bonus",
}

export enum EntityBonusType {
  REPLACER = "replacer",
  SPAWN = "spawn",
  LASER = "laser",
}

export interface WorldEntity {
  type: EntityType;
  subtype: string;
  toString(): string;
}
