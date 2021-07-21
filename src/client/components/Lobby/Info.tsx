import React, {useState, useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import dayjs from 'dayjs';

import LobbyOptions from '~type/LobbyOptions';
import LobbySession from '~type/LobbySession';
import PlayerInfo from '~type/PlayerInfo';

import './styles.scss';

interface ComponentProps {
    socket: Socket
    players: PlayerInfo[]
}

export default function Info({socket, players}: ComponentProps) {

    const {uuid} = useParams<{uuid: string}>();

    const [session, setSession] = useState<LobbySession>(null);
    const [options, setOptions] = useState<LobbyOptions>({});

    const date = useMemo(() => {
        return dayjs().hour(0).minute(0);
    }, []);

    const slots: Array<PlayerInfo | null> = useMemo(() => {
        const res = [];
        for (let i = 0; i < options.maxPlayers; i++) {
            const player = players.find((player) => (player.slot === i));
            res.push(player || null);
        }
        return res;
    }, [players, options.maxPlayers]);

    const current: PlayerInfo = useMemo(() => {
        return players.find((player) => (player.id === socket.id));
    }, [players]);

    useEffect(() => {
        socket.on('player:JoinLobby', (data) => {
            setOptions(data.options);
            setSession({
                step: data.step,
                timeout: data.timeout,
            });
        });
        socket.on('lobby:UpdateSession', setSession);
    }, []);

    useEffect(() => {
        if (!current || !session) {
            return;
        }
        const titleIdle = `Dothree #${uuid}`;
        const titleActive = 'Ваш ход!';
        let interval: NodeJS.Timer;
        if (session.step === current.slot && players.length === options.maxPlayers) {
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
    }, [(session && session.step), (current && current.slot), players.length]);

    // ---

    if (!session) {
        return null;
    }

    return (
        <div className="info">
            <div className="block players">
                <div className="label">Игроки</div>
                <div className="value">
                    {slots.map((player, slot) => (
                        player ? (
                            <div key={slot} className={`player slot${slot + 1}`}>
                                {(current && current.slot === slot) && <span>Вы</span>}
                            </div>
                        ) : (
                            <div key={slot} className="empty" />
                        )
                    ))}
                </div>
            </div>
            {(session.step !== null) && (
                <div className="block">
                    <div className="label">Ход</div>
                    <div className="value">
                        <div className={`player slot${session.step + 1}`} />
                        <div className={`timeout ${(session.timeout <= Math.round(options.timeout / 3) && current && current.slot === session.step) ? 'danger' : ''}`}>
                            {date.second(session.timeout).format('mm:ss')}
                        </div>
                    </div>
                </div>
            )}
            {(players.length === options.maxPlayers && session.step === null) && (
                <div className="block">
                    <div className="label" />
                    <div className="value">
                        <div className="restart">Рестарт игры через 5 секунд...</div>
                    </div>
                </div>
            )}
        </div>
    );

}