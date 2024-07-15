import React, { useMemo } from "react";

import { isPuttable } from "./utils/is-puttable";
import { useWorldContext } from "../hooks/use-world-context";
import type { WorldEntity } from "~/shared/entity/types";

import { Block, Pointer } from "./styled";

type Props = {
  data: WorldEntity;
  x: number;
  y: number;
  isCurrentStep: boolean;
  onPut: () => void;
};

export const Entity: React.FC<Props> = ({
  data,
  x,
  y,
  isCurrentStep,
  onPut,
}) => {
  const world = useWorldContext();

  const canBePut = useMemo(
    () => isCurrentStep && isPuttable(world, x, y),
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
