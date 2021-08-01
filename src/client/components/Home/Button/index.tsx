import React from 'react';
import {Container} from './styled';

interface ComponentProps {
    children: any
    onClick?: any
}

export default function Button({onClick, children}: ComponentProps) {

    return (
        <Container onClick={onClick}>{children}</Container>
    );

}

