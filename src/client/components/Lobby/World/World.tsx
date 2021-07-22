import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {Socket} from 'socket.io-client';
import styled from 'styled-components';
import Entity from './Entity';

import type WorldMap from '~type/WorldMap';
import PlayerInfo from '~type/PlayerInfo';

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

    // ---

    if (!world) {
        return null;
    }

    return (
        <Field ref={refWorld}>
            {world.map((line: string[], y: number) => (
                <Line key={y}>
                    {line.map((entity: string, x: number) => (
                        <Entity key={`${x}-${y}`} value={entity} world={world} x={x} y={y}
                                isPutting={current && current.slot === step} onPut={putEntity}/>
                    ))}
                </Line>
            ))}
        </Field>
    );

}

const Field = styled.div`
  user-select: none;
  display: flex;
  background: rgba(#323a45, 0.8);
  padding: 10px (10px + 14px) 10px 10px;
  flex-direction: column;
  box-shadow: (-17px - 14px) 0 0 #1E232A inset;
  overflow-y: scroll;
`;

const Line = styled.div`
  display: flex;
`;