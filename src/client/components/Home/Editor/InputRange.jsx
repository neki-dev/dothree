import React from 'react';
import PropTypes from 'prop-types';

const InputRange = ({label, value, ...props}) => (
    <div className="input input-range">
        <div className="input-label">{label}</div>
        <input type="range" defaultValue={value} {...props} />
        <div className="input-value">{value}</div>
    </div>
);

InputRange.defaultProps = {
    onChange: undefined,
};

InputRange.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    onChange: PropTypes.func,
};

export default InputRange;