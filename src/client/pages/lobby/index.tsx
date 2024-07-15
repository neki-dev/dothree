import React, { useState, useEffect } from "react";

import { InfoPanel } from "./info-panel";
import { Waiting } from "./waiting";
import { World } from "./world";
import { useSocketContext } from "~/client/socket/hooks/use-socket-context";
import type { LobbyOptions } from "~/shared/lobby/types";
import { LobbyEvent } from "~/shared/lobby/types";
import type { PlayerInfo } from "~/shared/player/types";

import { Container, GameScreen, Error } from "./styled";

export const LobbyPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const [options, setOptions] = useState<LobbyOptions>();
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const socket = useSocketContext();
  const isReady = players.length === options?.maxPlayers;

  useEffect(() => {
    socket.on(LobbyEvent.Error, setError);
    socket.on(LobbyEvent.UpdatePlayers, setPlayers);
    socket.on(LobbyEvent.SendOptions, setOptions);

    return () => {
      socket.off(LobbyEvent.Error, setError);
      socket.off(LobbyEvent.UpdatePlayers, setPlayers);
      socket.off(LobbyEvent.SendOptions, setOptions);
    };
  }, []);

  return (
    <Container>
      {error ? (
        <Error>
          <Error.Message>{error}</Error.Message>
        </Error>
      ) : (
        <>
          {!isReady && (
            <Waiting
              currentPlayers={players.length}
              maxPlayers={options?.maxPlayers}
            />
          )}

          <GameScreen>
            <World players={players} />
            <InfoPanel players={players} options={options} />
          </GameScreen>
        </>
      )}
    </Container>
  );
};
