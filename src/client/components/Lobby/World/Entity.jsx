import React, {useMemo} from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const Entity = ({value, world, x, y, isPutting, onPut}) => {

    const isAllow = useMemo(() => {
        const [type] = value.split('-');
        return (isPutting && ['empty', 'bonus'].includes(type) && canBePlaced(world, x, y));
    }, [world, isPutting]);

    // ---

    return (
        <div className={`entity ${value.replace(/-/g, ' ')} ${isAllow ? 'allow' : ''}`} onClick={isAllow ? () => onPut(x, y) : undefined}>
            {isAllow && <div className="pointer" />}
        </div>
    );

};

const canBePlaced = (map, x, y) => {
    if (y + 1 === map.length) {
        return true;
    } else {
        const [type] = map[y + 1][x].split('-');
        return ['player', 'block'].includes(type);
    }
};

Entity.defaultProps = {
    isPutting: false,
};

Entity.propTypes = {
    value: PropTypes.string.isRequired,
    world: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isPutting: PropTypes.bool,
    onPut: PropTypes.func.isRequired,
};

export default Entity;