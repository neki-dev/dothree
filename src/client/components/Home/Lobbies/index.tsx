import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import {Socket} from 'socket.io-client';
import LobbyInfo from '~type/LobbyInfo';
import {Title, LobbyList, Lobby, DataGroup} from './styled';

interface ComponentProps {
    socket: Socket
}

export default function Lobbies({socket}: ComponentProps) {

    const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);

    useEffect(() => {
        socket.on('updateLatestLobbies', setLobbies);
    }, []);

    return (lobbies.length > 0) ? (
        <>
            <Title>Или выбрать существующую</Title>
            <LobbyList>
                {lobbies.map((lobby) => (
                    <Lobby key={lobby.uuid} href={`/game/${lobby.uuid}`} target="_blank">
                        <DataGroup>
                            <Lobby.Date>{dayjs(lobby.date).format('HH:mm')}</Lobby.Date>
                            <Lobby.Name>{lobby.uuid}</Lobby.Name>
                        </DataGroup>
                        <Lobby.OnlineWrapper>
                            <Lobby.OnlineValue>{lobby.players.online}</Lobby.OnlineValue> / <Lobby.OnlineValue>{lobby.players.max}</Lobby.OnlineValue>
                        </Lobby.OnlineWrapper>
                    </Lobby>
                ))}
            </LobbyList>
        </>
    ) : null;

}