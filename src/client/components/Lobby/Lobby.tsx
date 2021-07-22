import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import useSocket from '~hook/useSocket';
import Info from './Info';
import World from './World';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

import './styles.scss';

export default function Lobby() {

    const {uuid} = useParams<{uuid: string}>();
    const socket: Socket = useSocket('/lobby', {uuid});

    const [error, setError] = useState<string>(null);
    const [options, setOptions] = useState<LobbyOptions>(null);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);

    useEffect(() => {
        socket.on('lobbyError', setError);
        socket.on('updatePlayers', setPlayers);
        socket.on('sendOptions', setOptions);
    }, []);

    // ---

    return (
        <div className="container container-lobby">
            {error ? (
                <div className="error">
                    <span>{error}</span>
                </div>
            ) : (
                <>
                    {(!options || players.length < options.maxPlayers) && (
                        <div className="waiting">
                            {options && (
                                <>
                                    <div className="loading">
                                        {Array(options.maxPlayers).fill(0).map((v, i) => (
                                            <span key={i} className={(i + 1 <= players.length) ? `player slot${i + 1}` : 'empty'} />
                                        ))}
                                    </div>
                                    <div className="players">
                                        <span>Вошло</span>
                                        <span className="number">{players.length}</span>
                                        <span>из</span>
                                        <span className="number">{options.maxPlayers}</span>
                                        <span>игроков</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <div className="game-wrapper">
                        <World socket={socket} players={players} />
                        <Info socket={socket} players={players} options={options || {}} />
                    </div>
                </>
            )}
        </div>
    );

}