export interface WorldEntity {
  type: string
  subtype: string
  toString(): string
}

export type WorldLocation = [number, number];

export type WorldMap = WorldEntity[][];
