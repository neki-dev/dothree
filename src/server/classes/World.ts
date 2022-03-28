import utils from '../utils';
import { WorldEntity, WorldLocation, WorldMap } from '~type/World';
import { LobbyOptions } from '~type/Lobby';
import Entity from './Entity';

const MAP_SIZE = [25, 11];
const MAP_ENTITY = {
  EMPTY: 'empty',
  BLOCK: 'block',
  PLAYER: 'player',
  BONUS: 'bonus',
};

const ENTITY_BONUS = {
  REPLACER: 'replacer',
  SPAWN: 'spawn',
  LASER: 'laser',
};

const WORLD_DIRECTIONS: WorldLocation[] = [
  [-1, 0], [-1, -1], [0, -1], [1, -1],
];

export default class World {
  readonly map: WorldMap = [];

  private readonly options: LobbyOptions;

  constructor(options: LobbyOptions) {
    this.options = options;
  }

  generateMap(): void {
    for (let y = 0; y < MAP_SIZE[1]; y += 1) {
      this.map[y] = [];
      for (let x = 0; x < MAP_SIZE[0]; x += 1) {
        const location: WorldLocation = [x, y];
        const entity = this.createRandomEntity(location);
        this.setEntity(location, entity);
      }
    }
  }

  place(slot: number, to: WorldLocation): WorldLocation[] | undefined {
    if (!this.canBePlaced(to)) {
      return undefined;
    }

    const locations: WorldLocation[] = [to];
    const targetEntity = this.getEntity(to);
    if (targetEntity.type === MAP_ENTITY.BONUS) {
      this.useBonus(locations, slot, targetEntity.subtype);
    } else if (targetEntity.type !== MAP_ENTITY.EMPTY) {
      return undefined;
    }

    locations.forEach((location) => {
      const playerEntity = new Entity(MAP_ENTITY.PLAYER, `slot${slot}`);
      this.setEntity(location, playerEntity);
    });

    return locations;
  }

  checkWinning(locations: WorldLocation[]): boolean {
    return locations.some((location) => {
      const results = this.getWinningLocations(location);
      if (results) {
        results.forEach((result) => {
          const entity = this.getEntity(result);
          entity.subtype += '-win';
        });
      }
      return Boolean(results);
    });
  }

  useBonus(locations: WorldLocation[], slot: number, type: string): void {
    switch (type) {
      case ENTITY_BONUS.REPLACER: {
        const puttedEntities: WorldLocation[] = [];
        this.eachMap((entity: WorldEntity, x: number, y: number) => {
          if (entity.type === MAP_ENTITY.PLAYER) {
            const entitySlot = Number(entity.subtype.replace(/^slot(\d)+.*$/, '$1'));
            if (entitySlot !== slot) {
              puttedEntities.push([x, y]);
            }
          }
        });
        if (puttedEntities.length > 0) {
          locations.push(utils.randomize(puttedEntities));
        }
        break;
      }

      case ENTITY_BONUS.SPAWN: {
        const emptyEntities: WorldLocation[] = [];
        this.eachMap((entity: WorldEntity, x: number, y: number) => {
          if (entity.type === MAP_ENTITY.EMPTY && this.canBePlaced([x, y])) {
            emptyEntities.push([x, y]);
          }
        });
        if (emptyEntities.length > 0) {
          locations.push(utils.randomize(emptyEntities));
        }
        break;
      }

      case ENTITY_BONUS.LASER: {
        const mainLocationX: number = locations[0][0];
        Object.keys(this.map).forEach((y) => {
          const emptyEntity = new Entity(MAP_ENTITY.EMPTY);
          this.setEntity([mainLocationX, Number(y)], emptyEntity);
        });
        const mainLocation: WorldLocation = [mainLocationX, this.map.length - 1];
        locations.splice(0, locations.length, mainLocation);
        break;
      }

      default: {
        break;
      }
    }
  }

  moveMap(): void {
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
      return [MAP_ENTITY.PLAYER, MAP_ENTITY.BLOCK].includes(entity.type);
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

  private eachMap(callback: Function): void {
    Object.entries(this.map).forEach(([y, line]) => {
      Object.entries(line).forEach(([x, entity]) => {
        callback(entity, Number(x), Number(y));
      });
    });
  }

  private getWinningLocations(from: WorldLocation): WorldLocation[] | undefined {
    let result;
    WORLD_DIRECTIONS.some((direction) => {
      for (let side = 0; side > -this.options.targetLength; side -= 1) {
        const locations = this.getLocationsByDirection(from, direction, side);
        if (this.isLocationsMatch(from, locations)) {
          result = locations;
          return true;
        }
      }
      return false;
    });

    return result;
  }

  private getLocationsByDirection(
    from: WorldLocation,
    direction: WorldLocation,
    side: number,
  ): WorldLocation[] {
    const locations: WorldLocation[] = [];
    for (let step = side; step <= (side + this.options.targetLength - 1); step += 1) {
      const point = <WorldLocation>from.map((f, i) => (f - direction[i] * step));
      if (point.every((c, i) => (c >= 0 && c < MAP_SIZE[i]))) {
        locations.push(point);
      }
    }

    return locations;
  }

  private isLocationsMatch(from: WorldLocation, locations: WorldLocation[]): boolean {
    return (
      locations.length === this.options.targetLength
      && locations.every((location) => this.isEntitiesEquals(from, location))
    );
  }

  private isEntitiesEquals(locationA: WorldLocation, locationB: WorldLocation): boolean {
    return (this.getEntity(locationA).toString() === this.getEntity(locationB).toString());
  }

  private createRandomEntity(location: WorldLocation): Entity {
    const { density, useBonuses, bonusing } = this.options;

    if (utils.probability(density * 10)) {
      return new Entity(MAP_ENTITY.BLOCK);
    }
    if (
      useBonuses
      && location[1] + 1 !== MAP_SIZE[1]
      && utils.probability(bonusing)
    ) {
      return new Entity(MAP_ENTITY.BONUS, utils.randomize([
        ENTITY_BONUS.REPLACER,
        ENTITY_BONUS.SPAWN,
        ENTITY_BONUS.LASER,
      ]));
    }

    return new Entity(MAP_ENTITY.EMPTY);
  }

  static locationIsValid(location: WorldLocation): boolean {
    return location.every((p, i) => (p >= 0 && p < MAP_SIZE[i]));
  }
}
