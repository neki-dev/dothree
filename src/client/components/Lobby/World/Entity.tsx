import React, {useMemo, useCallback} from 'react';

import type WorldMap from '~type/WorldMap';

import './styles.scss';

interface ComponentProps {
    value: string,
    world: WorldMap,
    x: number,
    y: number,
    isPutting?: boolean,
    onPut: Function,
}

export default function Entity({value, world, x, y, isPutting = false, onPut}: ComponentProps) {

    const canBePlaced = useCallback((x: number, y: number) => {
        if (y + 1 === world.length) {
            return true;
        } else {
            const [type] = world[y + 1][x].split('-');
            return ['player', 'block'].includes(type);
        }
    }, [world]);

    const isAllow: boolean = useMemo(() => {
        const [type] = value.split('-');
        return (isPutting && ['empty', 'bonus'].includes(type) && canBePlaced(x, y));
    }, [isPutting, canBePlaced]);

    // ---

    return (
        <div className={`entity ${value.replace(/-/g, ' ')} ${isAllow ? 'allow' : ''}`} onClick={isAllow ? () => onPut(x, y) : undefined}>
            {isAllow && <div className="pointer" />}
        </div>
    );

}