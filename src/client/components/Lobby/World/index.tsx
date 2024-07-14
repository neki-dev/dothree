import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react';

import { Entity } from './Entity';
import { SocketContext } from '~context/SocketContext';
import { WorldContext } from '~context/WorldContext';
import type { WorldEntity } from '~type/entity';
import { LobbyEvent } from '~type/lobby';
import type { PlayerInfo } from '~type/player';
import type { WorldMap } from '~type/world';

import { Field, Line } from './styled';

type Props = {
  players: PlayerInfo[]
};

export const World: React.FC<Props> = ({ players }) => {
  const [world, setWorld] = useState<WorldMap>();
  const [step, setStep] = useState<number>();

  const socket = useContext(SocketContext);

  const refWorld = useRef<HTMLDivElement>(null);

  const current = useMemo(
    () => players.find((player) => player.id === socket.id),
    [players],
  );

  const putEntity = (x: number, y: number) => {
    socket.emit(LobbyEvent.PutEntity, [x, y]);
  };

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
                isCurrentStep={step === current?.slot}
                onPut={() => putEntity(x, y)}
              />
            ))}
          </Line>
        ))}
      </WorldContext.Provider>
    </Field>
  ) : null;
};
