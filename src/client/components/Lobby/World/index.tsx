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
    }, []);

    useEffect(() => {
        socket.on('updateStep', setStep);
        socket.on('updateWorldMap', setWorld);
        return () => {
            socket.off('updateStep', setStep);
            socket.off('updateWorldMap', setWorld);
        };
    }, []);

    return world ? (
        <Field ref={refWorld}>
            {world.map((line: string[], y: number) => (
                <Line key={y}>
                    {line.map((entity: string, x: number) => (
                        <Entity key={`${x}-${y}`} value={entity} world={world} x={x} y={y} isPutting={current && current.slot === step} onPut={putEntity} />
                    ))}
                </Line>
            ))}
        </Field>
    ) : null;

}

