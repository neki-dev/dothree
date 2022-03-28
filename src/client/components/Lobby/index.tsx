import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '~context/SocketContext';
import Info from './Info';
import World from './World';
import { LobbyOptions } from '~type/Lobby';
import { PlayerInfo } from '~type/Player';
import {
  Container, GameScreen, Error, Status, WaitingOverlay, Loading,
} from './styled';

export default function Lobby() {
  const [error, setError] = useState<string>(null);
  const [options, setOptions] = useState<LobbyOptions>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const socket = useContext(SocketContext);

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
          {(!options || players.length < options.maxPlayers) && (
            <WaitingOverlay>
              {options && (
              <>
                <Loading>
                  {Array(options.maxPlayers).fill(0).map((v, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Loading.Block key={i} slot={i} empty={i + 1 > players.length} />
                  ))}
                </Loading>
                <Status>
                  <Status.String>Вошло</Status.String>
                  <Status.Number>{players.length}</Status.Number>
                  <Status.String>из</Status.String>
                  <Status.Number>{options.maxPlayers}</Status.Number>
                  <Status.String>игроков</Status.String>
                </Status>
              </>
              )}
            </WaitingOverlay>
          )}
          <GameScreen>
            <World players={players} />
            <Info players={players} options={options || {}} />
          </GameScreen>
        </>
      )}
    </Container>
  );
}
