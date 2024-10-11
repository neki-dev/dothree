import React, { useState, useEffect, useMemo, useRef } from "react";

import { WorldContext } from "./context";
import { Entity } from "./entity";
import { useSocketContext } from "~/client/socket/hooks/use-socket-context";
import type { WorldEntity } from "~/shared/entity/types";
import { LobbyEvent } from "~/shared/lobby/types";
import type { PlayerInfo } from "~/shared/player/types";
import type { WorldMap } from "~/shared/world/types";

import { Field, Line } from "./styled";

type Props = {
  players: PlayerInfo[];
};

export const World: React.FC<Props> = ({ players }) => {
  const [world, setWorld] = useState<WorldMap>();
  const [step, setStep] = useState<number>();

  const socket = useSocketContext();

  const refWorld = useRef<HTMLDivElement>(null);

  const current = useMemo(() => (
    players.find((player) => player.id === socket.id)
  ), [players]);

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
    <Field ref={refWorld}>
      <WorldContext.Provider value={world}>
        {world.map((line: WorldEntity[], y: number) => (
          <Line key={y}>
            {line.map((entity: WorldEntity, x: number) => (
              <Entity
                key={`${x}-${y}`}
                data={entity}
                x={x}
                y={y}
                active={step === current?.slot}
                onPut={() => putEntity(x, y)}
              />
            ))}
          </Line>
        ))}
      </WorldContext.Provider>
    </Field>
  ) : null;
};
