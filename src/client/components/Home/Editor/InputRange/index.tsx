import React, {useCallback} from 'react';
import {Container, Range, Label, Value} from './styled';

interface ComponentProps {
    label: string
    name: string
    value: number
    min: number
    max: number
    step?: number
    onChange: Function
}

export default function InputRange({label, value, min, max, step = 1, onChange}: ComponentProps) {

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.name, Number(e.target.value));
    }, [onChange]);

    return (
        <Container>
            <Label>{label}</Label>
            <Range defaultValue={value} min={min} max={max} step={step} onChange={handleChange} />
            <Value>{value}</Value>
        </Container>
    );

}