import React, { useContext, useMemo } from 'react';

import { WorldContext } from '~context/WorldContext';
import { WorldEntity } from '~type/entity';

import { canBePutTo } from './helpers';

import { Block, Pointer } from './styled';

type Props = {
  data: WorldEntity
  x: number
  y: number
  isCurrentStep: boolean
  onPut: () => void
};

export const Entity: React.FC<Props> = ({
  data,
  x,
  y,
  isCurrentStep,
  onPut,
}) => {
  const world = useContext(WorldContext);

  const canBePut = useMemo(
    () => isCurrentStep && canBePutTo(world, x, y),
    [world, isCurrentStep],
  );

  return (
    <Block
      entity={data}
      allow={canBePut}
      onClick={canBePut ? onPut : undefined}
      data-testid="entity"
    >
      {canBePut && <Pointer />}
    </Block>
  );
};
