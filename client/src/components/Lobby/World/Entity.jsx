import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import utils from '@lib/utils';

import './styles.scss';

const Entity = ({value, world, x, y, isPutting, onPut}) => {

    const isAllow = useMemo(() => {
        const [type] = value.split('-');
        return (isPutting && ['empty', 'bonus'].includes(type) && utils.mainstay(world, x, y));
    }, [world, isPutting]);

    // ---

    return (
        <div className={`entity ${value.replace(/-/g, ' ')} ${isAllow ? 'allow' : ''}`} onClick={isAllow ? () => onPut(x, y) : undefined}>
            {isAllow && <div className="pointer" />}
        </div>
    );

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