import React, { useMemo } from 'react';
import { WorldMap, WorldEntity } from '~type/World';
import { Block, Pointer } from './styled';

type ComponentProps = {
  data: WorldEntity
  world: WorldMap
  x: number
  y: number
  isPutting?: boolean
  onPut: Function
};

export default function Entity({
  data, world, x, y, isPutting, onPut,
}: ComponentProps) {
  const canBePlaced = (toX: number, toY: number): boolean => {
    if (toY + 1 === world.length) {
      return true;
    }
    const entity = world[toY + 1][toX];
    return ['player', 'block'].includes(entity.type);
  };

  const isAllow = useMemo<boolean>(() => (
    (isPutting && ['empty', 'bonus'].includes(data.type) && canBePlaced(x, y))
  ), [world, isPutting]);

  return (
    <Block
      entity={data}
      allow={isAllow || undefined}
      onClick={isAllow ? () => onPut(x, y) : undefined}
    >
      {isAllow && (
        <Pointer />
      )}
    </Block>
  );
}

Entity.defaultProps = {
  isPutting: false,
};
