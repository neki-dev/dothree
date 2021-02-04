import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import dayjs from 'dayjs';

import './styles.scss';

const Info = ({socket, players}) => {

    const {uuid} = useParams();

    const [data, setData] = useState(null);
    const [options, setOptions] = useState({});

    const date = useMemo(() => dayjs().hour(0).minute(0), []);

    const slots = useMemo(() => {
        const res = [];
        for (let i = 0; i < options.maxPlayers; i++) {
            const player = players.find((player) => (player.slot === i));
            res.push(player || null);
        }
        return res;
    }, [players, options.maxPlayers]);

    const current = useMemo(() => {
        return players.find((player) => (player.id === socket.id));
    }, [players]);

    useEffect(() => {
        socket.on('player:JoinLobby', (data) => {
            setOptions(data.options);
            setData({
                step: data.step,
                timeout: data.timeout,
            });
        });
        socket.on('lobby:UpdateTick', setData);
    }, []);

    useEffect(() => {
        if (!current || !data) {
            return;
        }
        const titleIdle = `Threedo #${uuid}`;
        const titleActive = 'Ваш ход!';
        let interval;
        if (data.step === current.slot && players.length === options.maxPlayers) {
            document.title = titleActive;
            interval = setInterval(() => {
                document.title = (document.title === titleActive) ? titleIdle : titleActive;
            }, 1000);
        } else {
            document.title = titleIdle;
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [(data && data.step), (current && current.slot), players.length]);

    // ---

    if (!data) {
        return null;
    }

    return (
        <div className="info">
            <div className="block players">
                <div className="label">Игроки</div>
                <div className="value">
                    {slots.map((player, slot) => (
                        player
                            ? (
                                <div key={slot} className={`player slot${slot + 1}`}>
                                    {(current && current.slot === slot) && <span>Вы</span>}
                                </div>
                            )
                            : <div key={slot} className="empty" />
                    ))}
                </div>
            </div>
            {(data.step !== null) && (
                <div className="block">
                    <div className="label">Ход</div>
                    <div className="value">
                        <div className={`player slot${data.step + 1}`} />
                        <div className={`timeout ${(data.timeout <= Math.round(options.timeout / 3) && current && current.slot === data.step) ? 'danger' : ''}`}>
                            {date.second(data.timeout).format('mm:ss')}
                        </div>
                    </div>
                </div>
            )}
            {(players.length === options.maxPlayers && data.step === null) && (
                <div className="block">
                    <div className="label" />
                    <div className="value">
                        <div className="restart">Рестарт игры через 3 секунды...</div>
                    </div>
                </div>
            )}
        </div>
    );

};

Info.propTypes = {
    socket: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        slot: PropTypes.number.isRequired,
    })).isRequired,
};

export default Info;