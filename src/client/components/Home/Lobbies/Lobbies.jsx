import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import './styles.scss';

const Lobbies = ({socket}) => {

    const [lobbies, setLobbies] = useState([]);

    useEffect(() => {
        socket.on('player:UpdateLobbies', setLobbies);
    }, []);

    // ---

    return (lobbies.length > 0)
        ? (
            <>
                <div className="lobby-title">Или выбрать существующую</div>
                <div className="lobby-list">
                    {lobbies.map((lobby) => (
                        <a key={lobby.uuid} className="lobby-item" href={`/game/${lobby.uuid}`} target="_blank">
                            <div className="group">
                                <span className="date">{dayjs(lobby.date).format('HH:mm')}</span>
                                <span className="name">{lobby.uuid}</span>
                            </div>
                            <span className="players">
                                <b>{lobby.players.online}</b> / <b>{lobby.players.max}</b>
                            </span>
                        </a>
                    ))}
                </div>
            </>
        )
        : null;

};

Lobbies.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default Lobbies;