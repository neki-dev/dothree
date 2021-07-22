import React, {useState, useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import styled, {css} from 'styled-components';
import Countdown from './Countdown';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

interface ComponentProps {
    socket: Socket
    players: PlayerInfo[]
    options: LobbyOptions
}

export default function Info({socket, players, options}: ComponentProps) {

    const {uuid} = useParams<{uuid: string}>();

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
        <InfoContainer>
            <Block>
                <BlockLabel>Игроки</BlockLabel>
                <BlockValue>
                    {slots.map((player, slot) => (
                        player ? (
                            <Player key={slot} slot={slot}>
                                {(current && current.slot === slot) && (
                                    <SelfLabel>Вы</SelfLabel>
                                )}
                            </Player>
                        ) : (
                            <EmptySlot key={slot} />
                        )
                    ))}
                </BlockValue>
            </Block>
            {(step !== null) && (
                <Block>
                    <BlockLabel>Ход</BlockLabel>
                    <BlockValue>
                        <Player slot={step} />
                        <Countdown key={step} value={options.timeout} isCurrent={current && current.slot === step} />
                    </BlockValue>
                </Block>
            )}
            {(players.length === options.maxPlayers && step === null) && (
                <Block>
                    <BlockLabel />
                    <BlockValue>
                        <RestartMessage>Рестарт игры через 5 секунд...</RestartMessage>
                    </BlockValue>
                </Block>
            )}
        </InfoContainer>
    );

}

const InfoContainer = styled.div`
    background: #19222D;
    padding: 23px 35px 27px 35px;
    display: flex;
    align-items: center;
`;

const Block = styled.div`
    text-transform: uppercase;
    &:not(:last-child) {
        margin-right: 35px;
    }
`;

const BlockLabel = styled.div`
    margin-bottom: 10px;
    font-size: 10px;
    letter-spacing: 1px;
    height: 11px;
    color: rgba(255,255,255, 0.6);
`;

const BlockValue = styled.div`
    display: flex;
    align-items: center;
`;

const Player: any = styled.div<{
    slot: number
}>`
    min-width: 32px;
    max-width: 32px;
    min-height: 32px;
    max-height: 32px;
    border-radius: 8%;
    box-shadow: 0 5px 10px rgba(0,0,0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(p) => {
        switch (p.slot) {
            case 0: return css`linear-gradient(135deg, #ffb300 0%, #ff7300 100%)`;
            case 1: return css`linear-gradient(135deg, #e47dff 0%, #9248a6 100%)`;
            case 2: return css`linear-gradient(135deg, #3dcbf0 0%, #1b86a2 100%)`;
            case 3: return css`linear-gradient(135deg, #f05656 0%, #b53a3a 100%)`;
            case 4: return css`linear-gradient(135deg, #a3e75f 0%, #5ea21b 100%)`;
        }
    }};
    &:not(:last-child) {
        margin-right: 5px;
    }
`;

const SelfLabel = styled.span`
    color: #fff;
    background: rgba(0,0,0, 0.7);
    padding: 2px 3px;
    font-size: 9px;
    border-radius: 3px;
`;

const EmptySlot = styled.div`
    background: #aaa;
    width: 8px;
    height: 8px;
    margin: 8px;
    border-radius: 4px;
    &:not(:last-child) {
        margin-right: 5px;
    }
`;

const RestartMessage = styled.div`
    font-size: 11px;
`;