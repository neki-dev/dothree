import React, { useMemo } from "react";

import { isPuttable } from "./utils/is-puttable";
import { useWorldContext } from "../hooks/use-world-context";
import type { WorldEntity } from "~/shared/entity/types";

import { Block, Pointer } from "./styled";

type Props = {
  data: WorldEntity;
  x: number;
  y: number;
  active: boolean;
  onPut: () => void;
};

export const Entity: React.FC<Props> = ({ data, x, y, active, onPut }) => {
  const world = useWorldContext();

  const puttable = useMemo(() => (
    active && isPuttable(world, x, y)
  ), [world, active]);

  return (
    <Block
      entity={data}
      allow={puttable}
      onClick={puttable ? onPut : undefined}
    >
      {puttable && <Pointer />}
    </Block>
  );
};
