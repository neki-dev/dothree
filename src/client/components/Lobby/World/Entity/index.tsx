import React, { useContext, useMemo } from 'react';

import { WorldContext } from '~context/WorldContext';
import { WorldEntity } from '~type/Entity';

import { canBePutTo } from './helpers';

import { Block, Pointer } from './styled';

type ComponentProps = {
  data: WorldEntity
  x: number
  y: number
  isCurrentStep?: boolean
  onPut: () => void
};

export function Entity({
  data, x, y, isCurrentStep, onPut,
}: ComponentProps) {
  const world = useContext(WorldContext);

  const canBePut = useMemo<boolean>(() => (
    (isCurrentStep && canBePutTo(world, x, y))
  ), [world, isCurrentStep]);

  return (
    <Block
      entity={data}
      allow={canBePut}
      onClick={canBePut ? onPut : undefined}
      data-testid="entity"
    >
      {canBePut && (
        <Pointer />
      )}
    </Block>
  );
}

Entity.defaultProps = {
  isCurrentStep: false,
};
