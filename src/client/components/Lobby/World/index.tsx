import React, {
  useState, useEffect, useCallback, useMemo, useRef, useContext,
} from 'react';
import { SocketContext } from '~context/SocketContext';
import { WorldContext } from '~context/WorldContext';
import Entity from './Entity';
import { WorldMap } from '~type/World';
import { WorldEntity } from '~type/Entity';
import { PlayerInfo } from '~type/Player';
import { Field, Line } from './styled';

type ComponentProps = {
  players: PlayerInfo[]
};

export default function World({ players }: ComponentProps) {
  const [world, setWorld] = useState<WorldMap>(null);
  const [step, setStep] = useState<number>(null);

  const socket = useContext(SocketContext);

  const refWorld = useRef<HTMLDivElement>(null);

  const current = useMemo<PlayerInfo>(() => (
    players.find((player) => (player.id === socket.id))
  ), [players]);

  const putEntity = useCallback((x: number, y: number) => {
    socket.emit('putEntity', [x, y]);
  }, []);

  useEffect(() => {
    socket.on('updateStep', setStep);
    socket.on('updateWorldMap', setWorld);

    return () => {
      socket.off('updateStep', setStep);
      socket.off('updateWorldMap', setWorld);
    };
  }, []);

  return world ? (
    <Field ref={refWorld} data-testid="world">
      <WorldContext.Provider value={world}>
        {world.map((line: WorldEntity[], y: number) => (
        // eslint-disable-next-line react/no-array-index-key
          <Line key={y}>
            {line.map((entity: WorldEntity, x: number) => (
              <Entity
              // eslint-disable-next-line react/no-array-index-key
                key={`${x}-${y}`} data={entity}
                x={x} y={y} isCurrentStep={current && current.slot === step}
                onPut={() => putEntity(x, y)}
              />
            ))}
          </Line>
        ))}
      </WorldContext.Provider>
    </Field>
  ) : null;
}
