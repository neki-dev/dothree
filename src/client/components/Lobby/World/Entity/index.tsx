import React, {useMemo, useCallback} from 'react';
import {Block, Pointer} from './styled';

import type WorldMap from '~type/WorldMap';

interface ComponentProps {
    value: string
    world: WorldMap
    x: number
    y: number
    isPutting?: boolean
    onPut: Function
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

    return (
        <Block types={value.split('-')} allow={isAllow} onClick={isAllow ? () => onPut(x, y) : undefined}>
            {isAllow && <Pointer />}
        </Block>
    );

}
