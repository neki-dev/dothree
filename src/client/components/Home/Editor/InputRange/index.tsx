import React, {useCallback, useState} from 'react';
import {Container, Group, Controls, Label, Value} from './styled';

interface ComponentProps {
    label: string
    name: string
    defaultValue: number
    tooltip?: string
    min: number
    max: number
    step?: number
    onChange: Function
}

export default function InputRange({label, name, defaultValue, min, max, step = 1, tooltip, onChange}: ComponentProps) {

    const [value, setValue] = useState<number>(defaultValue);

    const changeValue = useCallback((shift: 1 | -1) => {
        const newValue: number = value + (shift * step);
        if (newValue >= min && newValue <= max) {
            setValue(newValue);
            if (onChange) {
                onChange(name, newValue);
            }
        }
    }, [value, name, min, max, onChange]);

    return (
        <Container title={tooltip}>
            <Label>{label}</Label>
            <Group>
                <Controls>
                    <Controls.Dec onClick={() => changeValue(-1)} />
                    <Value small={max >= 10}>{value}</Value>
                    <Controls.Inc onClick={() => changeValue(1)} />
                </Controls>
            </Group>
        </Container>
    );

}