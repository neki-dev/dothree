import React, {useState, useEffect, useContext} from 'react';
import {SocketContext} from '~context/SocketContext';
import LobbyInfo from '~type/LobbyInfo';
import {Title, LobbyList, Lobby} from './styled';

export default function Lobbies() {

    const [lobbies, setLobbies] = useState<LobbyInfo[]>([]);

    const {socket} = useContext(SocketContext);

    useEffect(() => {
        socket.on('updateLatestLobbies', setLobbies);
        return () => {
            socket.off('updateLatestLobbies', setLobbies);
        };
    }, []);

    return (lobbies.length > 0) ? (
        <>
            <Title>Или выбрать существующую</Title>
            <LobbyList>
                {lobbies.map((lobby) => (
                    <Lobby key={lobby.uuid} href={`/game/${lobby.uuid}`} target="_blank">
                        <Lobby.Name>{lobby.uuid}</Lobby.Name>
                        <Lobby.OnlineWrapper>
                            <Lobby.OnlineValue>{lobby.players.online}</Lobby.OnlineValue> / <Lobby.OnlineValue>{lobby.players.max}</Lobby.OnlineValue>
                        </Lobby.OnlineWrapper>
                    </Lobby>
                ))}
            </LobbyList>
        </>
    ) : null;

}