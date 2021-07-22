import React, {useState, useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import Countdown from './Countdown';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

import './styles.scss';

interface ComponentProps {
    socket: Socket
    players: PlayerInfo[]
    options: LobbyOptions
}

export default function Info({socket, players, options}: ComponentProps) {

    const {uuid} = useParams<{uuid: string}>();

    const [step, setStep] = useState<number>(null);

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
        socket.on('updateStep', setStep);
    }, []);

    useEffect(() => {
        if (!current) {
            return;
        }
        const titleIdle = `Dothree #${uuid}`;
        const titleActive = 'Ваш ход!';
        let interval: NodeJS.Timer;
        if (step === current.slot && players.length === options.maxPlayers) {
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
    }, [step, (current && current.slot), players.length]);

    // ---

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
            {(step !== null) && (
                <div className="block">
                    <div className="label">Ход</div>
                    <div className="value">
                        <div className={`player slot${step + 1}`} />
                        <Countdown key={step} value={options.timeout} isCurrent={current && current.slot === step} />
                    </div>
                </div>
            )}
            {(players.length === options.maxPlayers && step === null) && (
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