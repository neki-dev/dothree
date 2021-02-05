import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import Entity from './Entity';

import './styles.scss';

const World = ({socket, players}) => {

    const [world, setWorld] = useState(null);
    const [step, setStep] = useState(null);

    const refWorld = useRef(null);

    const current = useMemo(() => {
        return players.find((player) => (player.id === socket.id));
    }, [players]);

    const putEntity = useCallback((x, y) => {
        socket.emit('player:PutEntity', [x, y]);
    }, [world]);

    useEffect(() => {
        socket.on('player:JoinLobby', (data) => {
            setWorld(data.world);
        });
        socket.on('lobby:UpdateTick', (data) => {
            setStep(data.step);
        });
        socket.on('lobby:UpdateWorld', setWorld);
    }, []);

    useEffect(() => {
        if (!refWorld.current) {
            return;
        }
        refWorld.current.scrollTop = refWorld.current.clientHeight;
    }, [refWorld.current]);

    // ---

    if (!world) {
        return null;
    }

    return (
        <div className="world" ref={refWorld}>
            {world.map((line, y) => (
                <div key={y} className="line">
                    {line.map((entity, x) => (
                        <Entity key={`${x}-${y}`} value={entity} world={world} x={x} y={y} isPutting={current && current.slot === step} onPut={putEntity} />
                    ))}
                </div>
            ))}
        </div>
    );

};

World.propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        slot: PropTypes.number.isRequired,
    })).isRequired,
};

export default World;