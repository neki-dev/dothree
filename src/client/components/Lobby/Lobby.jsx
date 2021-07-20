import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useSocket from '../../hooks/useSocket';
import Info from './Info';
import World from './World';

import './styles.scss';

export default () => {

    const {uuid} = useParams();
    const socket = useSocket('/lobby', {uuid});

    const [error, setError] = useState(null);
    const [lobby, setLobby] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on('player:JoinLobby', setLobby);
        socket.on('player:Error', setError);
        socket.on('lobby:UpdatePlayers', setPlayers);
    }, []);

    // ---

    return (
        <div className="container container-lobby">
            {error
                ? (
                    <div className="error">
                        <span>{error}</span>
                    </div>
                )
                : (
                    <>
                        {(!lobby || players.length < lobby.options.maxPlayers) && (
                            <div className="waiting">
                                {lobby && (
                                    <>
                                        <div className="loading">
                                            {Array(lobby.options.maxPlayers).fill(0).map((v, i) => (
                                                <span key={i} className={(i + 1 <= players.length) ? `player slot${i + 1}` : 'empty'} />
                                            ))}
                                        </div>
                                        <div className="players">
                                            <span>Вошло</span>
                                            <span className="number">{players.length}</span>
                                            <span>из</span>
                                            <span className="number">{lobby.options.maxPlayers}</span>
                                            <span>игроков</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <div className="game-wrapper">
                            <World socket={socket} players={players} />
                            <Info socket={socket} players={players} />
                        </div>
                    </>
                )
            }
        </div>
    );

};