import React, { useMemo } from 'react';

import { Status, WaitingOverlay, Loading } from './styled';

type ComponentProps = {
  currentPlayers: number
  maxPlayers?: number
};

export function Waiting({
  currentPlayers, maxPlayers,
}: ComponentProps) {
  const blocks = useMemo(() => {
    if (maxPlayers !== undefined) {
      return Array(maxPlayers).fill(0);
    }

    return null;
  }, [maxPlayers]);

  return (
    <WaitingOverlay>
      {blocks && (
        <>
          <Loading>
            {blocks.map((_, slot) => (
              <Loading.Block
                key={slot}
                slot={slot}
                empty={(slot + 1) > currentPlayers}
              />
            ))}
          </Loading>
          <Status>
            <Status.String>Joined</Status.String>
            <Status.Number data-testid="waitingCurrentPlayers">{currentPlayers}</Status.Number>
            <Status.String>from</Status.String>
            <Status.Number data-testid="waitingMaxPlayers">{maxPlayers}</Status.Number>
            <Status.String>players</Status.String>
          </Status>
        </>
      )}
    </WaitingOverlay>
  );
}

Waiting.defaultProps = {
  maxPlayers: undefined,
};
