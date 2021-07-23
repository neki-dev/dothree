import React, {useState, useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import Countdown from './Countdown';
import {Container, Block, Player, RestartMessage, EmptySlot} from './styled';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

interface ComponentProps {
    socket: Socket
    players: PlayerInfo[]
    options: LobbyOptions
}

export default function Info({socket, players, options}: ComponentProps) {

    const {uuid} = useParams<{ uuid: string }>();

    const [step, setStep] = useState<number>(null);

    const slots: Array<PlayerInfo | null> = useMemo(() => {
        const slots: Array<PlayerInfo | null> = [];
        for (let i = 0; i < options.maxPlayers; i++) {
            const player: PlayerInfo = players.find((player) => (player.slot === i));
            slots.push(player || null);
        }
        return slots;
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
        const titleIdle: string = `Dothree #${uuid}`;
        const titleActive: string = 'Ваш ход!';
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
        <Container>
            <Block>
                <Block.Label>Игроки</Block.Label>
                <Block.Value>
                    {slots.map((player, slot) => (
                        player ? (
                            <Player key={slot} slot={slot}>
                                {(current && current.slot === slot) && (
                                    <Player.SelfLabel>Вы</Player.SelfLabel>
                                )}
                            </Player>
                        ) : (
                            <EmptySlot key={slot}/>
                        )
                    ))}
                </Block.Value>
            </Block>
            {(step !== null) && (
                <Block>
                    <Block.Label>Ход</Block.Label>
                    <Block.Value>
                        <Player slot={step}/>
                        <Countdown key={step} value={options.timeout} isCurrent={current && current.slot === step}/>
                    </Block.Value>
                </Block>
            )}
            {(players.length === options.maxPlayers && step === null) && (
                <Block>
                    <Block.Label />
                    <Block.Value>
                        <RestartMessage>Рестарт игры через 5 секунд...</RestartMessage>
                    </Block.Value>
                </Block>
            )}
        </Container>
    );

}