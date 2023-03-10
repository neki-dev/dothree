import { EntityType } from '~type/Entity';
import { WorldMap } from '~type/World';

export function canBePutTo(world: WorldMap, x: number, y: number): boolean {
  const entity = world[y][x];

  if (![EntityType.EMPTY, EntityType.BONUS].includes(entity.type)) {
    return false;
  }

  if (y + 1 === world.length) {
    return true;
  }

  const entityDown = world[y + 1][x];

  return [EntityType.PLAYER, EntityType.BLOCK].includes(entityDown.type);
}
