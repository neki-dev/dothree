import React, {useState, useEffect, useCallback, useMemo, useRef, useContext} from 'react';
import {SocketContext} from '~context/SocketContext';
import Entity from './Entity';
import {Field, Line} from './styled';

import type WorldMap from '~type/WorldMap';
import PlayerInfo from '~type/PlayerInfo';

interface ComponentProps {
    players: PlayerInfo[]
}

export default function World({players}: ComponentProps) {

    const [world, setWorld] = useState<WorldMap>(null);
    const [step, setStep] = useState<number>(null);

    const {socket} = useContext(SocketContext);

    const refWorld = useRef<HTMLDivElement>(null);

    const current: PlayerInfo = useMemo(() => {
        return players.find((player) => (player.id === socket.id));
    }, [players]);

    const putEntity = useCallback((x: number, y: number) => {
        socket.emit('putEntity', [x, y]);
    }, [world]);

    useEffect(() => {
        socket.on('updateStep', setStep);
        socket.on('updateWorldMap', setWorld);
    }, []);

    useEffect(() => {
        if (!refWorld.current) {
            return;
        }
        const onScroll = () => {
            // console.log('a', e.target.scrollTop);
            // console.log('b', e.target.clientHeight, e.target.scrollHeight);
        };
        refWorld.current.scrollTop = refWorld.current.clientHeight;
        refWorld.current.addEventListener('scroll', onScroll);
        return () => {
            refWorld.current.removeEventListener('scroll', onScroll);
        };
    }, [refWorld.current]);

    if (!world) {
        return null;
    }

    return (
        <Field ref={refWorld}>
            {world.map((line: string[], y: number) => (
                <Line key={y}>
                    {line.map((entity: string, x: number) => (
                        <Entity key={`${x}-${y}`} value={entity} world={world} x={x} y={y} isPutting={current && current.slot === step} onPut={putEntity} />
                    ))}
                </Line>
            ))}
        </Field>
    );

}

