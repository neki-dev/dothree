import React, {useCallback} from 'react';
import {Container, Checkbox, Label} from './styled';

interface ComponentProps {
    label: string
    name: string
    value: boolean
    onChange: Function
}

export default function InputCheckbox({label, value, name, onChange}: ComponentProps) {

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.name, e.target.checked);
    }, [onChange]);

    return (
        <Container>
            <Checkbox defaultChecked={value} name={name} onChange={handleChange} />
            <Label>{label}</Label>
        </Container>
    );

}