import React, { useState, useEffect, useContext } from 'react';

import { SocketContext } from '~context/SocketContext';
import { LobbyEvent, LobbyInfo } from '~type/lobby';

import { Title, LobbyList, Lobby } from './styled';

export const Lobbies: React.FC = () => {
  const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(LobbyEvent.UpdateLatestLobbies, setLobbies);

    return () => {
      socket.off(LobbyEvent.UpdateLatestLobbies, setLobbies);
    };
  }, []);

  return lobbies.length > 0 ? (
    <>
      <Title>Or select existing</Title>
      <LobbyList>
        {lobbies.map((lobby) => (
          <Lobby
            key={lobby.uuid}
            href={`/game/${lobby.uuid}`}
            target="_blank"
            data-testid="open-lobby"
          >
            <Lobby.Name>{lobby.uuid}</Lobby.Name>
            <Lobby.OnlineWrapper>
              <Lobby.OnlineValue>{lobby.players.online}</Lobby.OnlineValue>
              {' '}
              /
              {' '}
              <Lobby.OnlineValue>{lobby.players.max}</Lobby.OnlineValue>
            </Lobby.OnlineWrapper>
          </Lobby>
        ))}
      </LobbyList>
    </>
  ) : null;
};
