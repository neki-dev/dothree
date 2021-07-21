import React from 'react';

interface ComponentProps extends React.HTMLProps<HTMLInputElement> {
    label: string;
    value: number;
}

export default function InputRange({label, value, ...props}: ComponentProps) {
    return (
        <div className="input input-range">
            <div className="input-label">{label}</div>
            <input type="range" defaultValue={value} {...props} />
            <div className="input-value">{value}</div>
        </div>
    );
}