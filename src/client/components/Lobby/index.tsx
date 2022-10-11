import React, { useState, useEffect, useContext } from 'react';

import { SocketContext } from '~context/SocketContext';
import { LobbyOptions } from '~type/Lobby';
import { PlayerInfo } from '~type/Player';

import { Info } from './Info';
import { Waiting } from './Waiting';
import { World } from './World';

import { Container, GameScreen, Error } from './styled';

export function Lobby() {
  const [error, setError] = useState<string>(null);
  const [options, setOptions] = useState<LobbyOptions>({});
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const socket = useContext(SocketContext);

  const isReady = (players.length === options.maxPlayers);

  useEffect(() => {
    socket.on('lobbyError', setError);
    socket.on('updatePlayers', setPlayers);
    socket.on('sendOptions', setOptions);

    return () => {
      socket.off('lobbyError', setError);
      socket.off('updatePlayers', setPlayers);
      socket.off('sendOptions', setOptions);
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
              maxPlayers={options.maxPlayers}
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
}
