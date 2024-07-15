import React, { useMemo } from "react";

import { Status, WaitingOverlay, Loading } from "./styled";

type Props = {
  currentPlayers: number;
  maxPlayers?: number;
};

export const Waiting: React.FC<Props> = ({ currentPlayers, maxPlayers }) => {
  const blocks = useMemo(() => Array(maxPlayers).fill(0), [maxPlayers]);

  return (
    <WaitingOverlay>
      {maxPlayers && (
        <>
          <Loading>
            {blocks.map((_, slot) => (
              <Loading.Block
                key={slot}
                slot={slot}
                empty={slot + 1 > currentPlayers}
              />
            ))}
          </Loading>

          <Status>
            <Status.String>Joined</Status.String>
            <Status.Number>{currentPlayers}</Status.Number>
            <Status.String>from</Status.String>
            <Status.Number>{maxPlayers}</Status.Number>
            <Status.String>players</Status.String>
          </Status>
        </>
      )}
    </WaitingOverlay>
  );
};
