import React, { useState, useEffect, useContext } from 'react';

import { Info } from './Info';
import { Waiting } from './Waiting';
import { World } from './World';
import { SocketContext } from '~context/SocketContext';
import type { LobbyOptions } from '~type/lobby';
import { LobbyEvent } from '~type/lobby';
import type { PlayerInfo } from '~type/player';

import { Container, GameScreen, Error } from './styled';

export const Lobby: React.FC = () => {
  const [error, setError] = useState<string>();
  const [options, setOptions] = useState<LobbyOptions>();
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const socket = useContext(SocketContext);

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
            <Info players={players} options={options} />
          </GameScreen>
        </>
      )}
    </Container>
  );
};
