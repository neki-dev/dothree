import React, {
  useState, useEffect, useCallback, useMemo, useRef, useContext,
} from 'react';

import { SocketContext } from '~context/SocketContext';
import { WorldContext } from '~context/WorldContext';
import { WorldMap } from '~root/src/types/world';
import { WorldEntity } from '~type/entity';
import { LobbyEvent } from '~type/lobby';
import { PlayerInfo } from '~type/player';

import { Entity } from './Entity';

import { Field, Line } from './styled';

type ComponentProps = {
  players: PlayerInfo[]
};

export function World({ players }: ComponentProps) {
  const [world, setWorld] = useState<WorldMap>(null);
  const [step, setStep] = useState<number>(null);

  const socket = useContext(SocketContext);

  const refWorld = useRef<HTMLDivElement>(null);

  const current = useMemo<PlayerInfo>(() => (
    players.find((player) => (player.id === socket.id))
  ), [players]);

  const putEntity = useCallback((x: number, y: number) => {
    socket.emit(LobbyEvent.PutEntity, [x, y]);
  }, []);

  useEffect(() => {
    socket.on(LobbyEvent.UpdateStep, setStep);
    socket.on(LobbyEvent.UpdateWorldMap, setWorld);

    return () => {
      socket.off(LobbyEvent.UpdateStep, setStep);
      socket.off(LobbyEvent.UpdateWorldMap, setWorld);
    };
  }, []);

  return world ? (
    <Field ref={refWorld} data-testid="world">
      <WorldContext.Provider value={world}>
        {world.map((line: WorldEntity[], y: number) => (
          <Line key={y}>
            {line.map((entity: WorldEntity, x: number) => (
              <Entity
                key={`${x}-${y}`}
                data={entity}
                x={x}
                y={y}
                isCurrentStep={current && current.slot === step}
                onPut={() => putEntity(x, y)}
              />
            ))}
          </Line>
        ))}
      </WorldContext.Provider>
    </Field>
  ) : null;
}
