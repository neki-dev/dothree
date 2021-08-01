import React, {useState, useEffect, useContext} from 'react';
import {SocketContext} from '~context/SocketContext';
import Info from './Info';
import World from './World';
import {Container, GameScreen, Error, Status, WaitingOverlay, Loading} from './styled';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

export default function Lobby() {

    const [error, setError] = useState<string>(null);
    const [options, setOptions] = useState<LobbyOptions>(null);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);

    const {socket} = useContext(SocketContext);

    useEffect(() => {
        socket.on('lobbyError', setError);
        socket.on('updatePlayers', setPlayers);
        socket.on('sendOptions', setOptions);
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

