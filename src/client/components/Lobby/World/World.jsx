import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import Entity from './Entity';

import './styles.scss';

// import SimpleBar from 'simplebar-react';
// import 'simplebar/dist/simplebar.min.css';

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

    // TODO: Sync renders
    useEffect(() => {
        socket.on('player:JoinLobby', (data) => {
            setWorld(data.world);
        });
        socket.on('lobby:UpdateMeta', (data) => {
            setStep(data.step);
        });
        socket.on('lobby:UpdateWorld', setWorld);
    }, []);

    useEffect(() => {
        if (!refWorld.current) {
            return;
        }
        const onScroll = (e) => {
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
    socket: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        slot: PropTypes.number.isRequired,
    })).isRequired,
};

export default World;