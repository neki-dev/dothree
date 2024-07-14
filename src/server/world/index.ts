import {
  WORLD_CHAIN_TARGET_LENGTH,
  WORLD_DIRECTIONS,
  WORLD_MAP_SIZE,
} from "./const";
import { Entity } from "../entity";
import { probability } from "../utils/probability";
import { randomize } from "../utils/randomize";
import type { WorldEntity } from "~/shared/entity/types";
import { EntityType, EntityBonusType } from "~/shared/entity/types";
import type { LobbyOptions } from "~/shared/lobby/types";
import type { WorldMap, WorldLocation } from "~/shared/world/types";

export class World {
  readonly map: WorldMap = [];

  private readonly options: LobbyOptions;

  constructor(options: LobbyOptions) {
    this.options = options;
  }

  public generateMap(): void {
    for (let y = 0; y < WORLD_MAP_SIZE[1]; y += 1) {
      this.map[y] = [];
      for (let x = 0; x < WORLD_MAP_SIZE[0]; x += 1) {
        const location: WorldLocation = [x, y];
        const entity = this.createRandomEntity(location);

        this.setEntity(location, entity);
      }
    }
  }

  public place(slot: number, to: WorldLocation): WorldLocation[] | undefined {
    if (!this.canBePlaced(to)) {
      return undefined;
    }

    const locations: WorldLocation[] = [to];
    const targetEntity = this.getEntity(to);

    if (!targetEntity) {
      return undefined;
    }

    if (targetEntity.type === EntityType.BONUS) {
      this.useBonus(locations, slot, targetEntity.subtype);
    } else if (targetEntity.type !== EntityType.EMPTY) {
      return undefined;
    }

    locations.forEach((location) => {
      const playerEntity = new Entity(EntityType.PLAYER, `slot${slot}`);

      this.setEntity(location, playerEntity);
    });

    return locations;
  }

  public checkWinning(locations: WorldLocation[]): boolean {
    return locations.some((location) => {
      const results = this.getWinningLocations(location);

      if (results) {
        results.forEach((result) => {
          const entity = this.getEntity(result);

          if (entity) {
            entity.subtype += "-win";
          }
        });
      }

      return Boolean(results);
    });
  }

  public useBonus(
    locations: WorldLocation[],
    slot: number,
    type: string,
  ): void {
    switch (type) {
      case EntityBonusType.REPLACER: {
        const puttedEntities: WorldLocation[] = [];

        this.eachMap((entity: WorldEntity, x: number, y: number) => {
          if (entity.type === EntityType.PLAYER) {
            const entitySlot = Number(
              entity.subtype.replace(/^slot(\d)+.*$/, "$1"),
            );

            if (entitySlot !== slot) {
              puttedEntities.push([x, y]);
            }
          }
        });
        if (puttedEntities.length > 0) {
          locations.push(randomize(puttedEntities));
        }
        break;
      }

      case EntityBonusType.SPAWN: {
        const emptyEntities: WorldLocation[] = [];

        this.eachMap((entity: WorldEntity, x: number, y: number) => {
          if (entity.type === EntityType.EMPTY && this.canBePlaced([x, y])) {
            emptyEntities.push([x, y]);
          }
        });
        if (emptyEntities.length > 0) {
          locations.push(randomize(emptyEntities));
        }
        break;
      }

      case EntityBonusType.LASER: {
        const mainLocationX: number = locations[0][0];

        Object.keys(this.map).forEach((y) => {
          const emptyEntity = new Entity(EntityType.EMPTY);

          this.setEntity([mainLocationX, Number(y)], emptyEntity);
        });
        const mainLocation: WorldLocation = [
          mainLocationX,
          this.map.length - 1,
        ];

        locations.splice(0, locations.length, mainLocation);
        break;
      }

      default: {
        break;
      }
    }
  }

  public moveMap(): void {
    Object.entries(this.map).forEach(([y, line]) => {
      line.shift();
      const location: WorldLocation = [line.length, Number(y)];
      const entity = this.createRandomEntity(location);

      this.setEntity(location, entity);
    });
  }

  private canBePlaced(location: WorldLocation): boolean {
    const [x, y] = location;

    if (y + 1 === this.map.length) {
      return true;
    }

    const entity = this.getEntity([x, y + 1]);

    if (entity) {
      return [EntityType.PLAYER, EntityType.BLOCK].includes(entity.type);
    }

    return false;
  }

  private setEntity(location: WorldLocation, entity: WorldEntity): void {
    if (!World.locationIsValid(location)) {
      return;
    }

    const [x, y] = location;

    this.map[y][x] = entity;
  }

  private getEntity(location: WorldLocation): WorldEntity | undefined {
    if (!World.locationIsValid(location)) {
      return undefined;
    }

    const [x, y] = location;

    return this.map[y][x];
  }

  private eachMap(
    callback: (entity: Entity, x: number, y: number) => void,
  ): void {
    Object.entries(this.map).forEach(([y, line]) => {
      Object.entries(line).forEach(([x, entity]) => {
        callback(entity, Number(x), Number(y));
      });
    });
  }

  private getWinningLocations(
    from: WorldLocation,
  ): WorldLocation[] | undefined {
    let result;

    WORLD_DIRECTIONS.some((direction) => {
      for (let side = 0; side > -WORLD_CHAIN_TARGET_LENGTH; side -= 1) {
        const locations = World.getLocationsByDirection(from, direction, side);

        if (this.isLocationsMatch(from, locations)) {
          result = locations;

          return true;
        }
      }

      return false;
    });

    return result;
  }

  private static getLocationsByDirection(
    from: WorldLocation,
    direction: WorldLocation,
    side: number,
  ): WorldLocation[] {
    const locations: WorldLocation[] = [];

    for (
      let step = side;
      step <= side + WORLD_CHAIN_TARGET_LENGTH - 1;
      step += 1
    ) {
      const point = <WorldLocation>from.map((f, i) => f - direction[i] * step);

      if (point.every((c, i) => c >= 0 && c < WORLD_MAP_SIZE[i])) {
        locations.push(point);
      }
    }

    return locations;
  }

  private isLocationsMatch(
    from: WorldLocation,
    locations: WorldLocation[],
  ): boolean {
    return (
      locations.length === WORLD_CHAIN_TARGET_LENGTH &&
      locations.every((location) => this.isEntitiesEquals(from, location))
    );
  }

  private isEntitiesEquals(
    locationA: WorldLocation,
    locationB: WorldLocation,
  ): boolean {
    const entityA = this.getEntity(locationA);

    if (!entityA) {
      return false;
    }

    const entityB = this.getEntity(locationB);

    if (!entityB) {
      return false;
    }

    return entityA.toString() === entityB.toString();
  }

  private createRandomEntity(location: WorldLocation): Entity {
    const { density, useBonuses, bonusing } = this.options;

    if (probability(density * 10)) {
      return new Entity(EntityType.BLOCK);
    }
    if (
      useBonuses &&
      location[1] + 1 !== WORLD_MAP_SIZE[1] &&
      probability(bonusing)
    ) {
      return new Entity(
        EntityType.BONUS,
        randomize([
          EntityBonusType.REPLACER,
          EntityBonusType.SPAWN,
          EntityBonusType.LASER,
        ]),
      );
    }

    return new Entity(EntityType.EMPTY);
  }

  public static locationIsValid(location: WorldLocation): boolean {
    return location.every((p, i) => p >= 0 && p < WORLD_MAP_SIZE[i]);
  }
}
