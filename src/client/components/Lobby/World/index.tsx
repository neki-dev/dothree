import React, {
  useState, useEffect, useCallback, useMemo, useRef, useContext,
} from 'react';
import { SocketContext } from '~context/SocketContext';
import Entity from './Entity';
import { WorldMap, WorldEntity } from '~type/World';
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
    <Field ref={refWorld}>
      {world.map((line: WorldEntity[], y: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <Line key={y}>
          {line.map((entity: WorldEntity, x: number) => (
            <Entity
              // eslint-disable-next-line react/no-array-index-key
              key={`${x}-${y}`} data={entity} world={world}
              x={x} y={y} isPutting={current && current.slot === step}
              onPut={putEntity}
            />
          ))}
        </Line>
      ))}
    </Field>
  ) : null;
}
