import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {Socket} from 'socket.io-client';
import Entity from './Entity';

import WorldMap from '~type/WorldMap';
import PlayerInfo from '~type/PlayerInfo';

import './styles.scss';

interface ComponentProps {
    socket: Socket;
    players: PlayerInfo[];
}

export default function World({socket, players}: ComponentProps) {

    const [world, setWorld] = useState<WorldMap>(null);
    const [step, setStep] = useState<number>(null);

    const refWorld = useRef<HTMLDivElement>(null);

    const current: PlayerInfo = useMemo(() => {
        return players.find((player) => (player.id === socket.id));
    }, [players]);

    const putEntity = useCallback((x, y) => {
        socket.emit('player:PutEntity', [x, y]);
    }, [world]);

    useEffect(() => {
        socket.on('player:JoinLobby', (data) => {
            setWorld(data.map);
        });
        socket.on('lobby:UpdateSession', (data) => {
            setStep(data.step);
            setWorld(data.map);
        });
    }, []);

    useEffect(() => {
        if (!refWorld.current) {
            return;
        }
        const onScroll = (e: any) => {
            console.log('a', e.target.scrollTop);
            console.log('b', e.target.clientHeight, e.target.scrollHeight);
        };
        refWorld.current.scrollTop = refWorld.current.clientHeight;
        refWorld.current.addEventListener('scroll', onScroll);
        return () => {
            refWorld.current.removeEventListener('scroll', onScroll);
        };
    }, [refWorld.current]);

    // ---

    if (!world) {
        return null;
    }

    return (
        <div className="world" ref={refWorld}>
            {world.map((line, y: number) => (
                <div key={y} className="line">
                    {line.map((entity, x: number) => (
                        <Entity key={`${x}-${y}`} value={entity} world={world} x={x} y={y} isPutting={current && current.slot === step} onPut={putEntity} />
                    ))}
                </div>
            ))}
        </div>
    );

}