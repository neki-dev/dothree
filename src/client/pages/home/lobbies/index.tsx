import React, { useState, useEffect } from "react";

import { useSocketContext } from "~/client/socket/hooks/use-socket-context";
import type { LobbyInfo } from "~/shared/lobby/types";
import { LobbyEvent } from "~/shared/lobby/types";

import { Title, LobbyList, Lobby } from "./styled";

export const Lobbies: React.FC = () => {
  const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);

  const socket = useSocketContext();

  useEffect(() => {
    socket.on(LobbyEvent.UpdateLatestLobbies, setLobbies);

    return () => {
      socket.off(LobbyEvent.UpdateLatestLobbies, setLobbies);
    };
  }, []);

  return lobbies.length > 0 && (
    <>
      <Title>Or select existing</Title>
      <LobbyList>
        {lobbies.map((lobby) => (
          <Lobby
            key={lobby.uuid}
            href={`/game/${lobby.uuid}`}
            target="_blank"
          >
            <Lobby.Name>{lobby.uuid}</Lobby.Name>
            <Lobby.OnlineWrapper>
              <Lobby.OnlineValue>{lobby.players.online}</Lobby.OnlineValue> /{" "}
              <Lobby.OnlineValue>{lobby.players.max}</Lobby.OnlineValue>
            </Lobby.OnlineWrapper>
          </Lobby>
        ))}
      </LobbyList>
    </>
  );
};
