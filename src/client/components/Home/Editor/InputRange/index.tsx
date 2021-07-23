import React from 'react';
import {Container, Range, Label, Value} from './styled';

interface ComponentProps extends React.HTMLProps<HTMLInputElement> {
    label: string;
    value: number;
}

export default function InputRange({label, value, ...props}: ComponentProps) {
    return (
        <Container>
            <Label>{label}</Label>
            <Range defaultValue={value} {...props} />
            <Value>{value}</Value>
        </Container>
    );
}