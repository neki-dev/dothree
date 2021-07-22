import React from 'react';
import styled from 'styled-components';

interface ComponentProps extends React.HTMLProps<HTMLInputElement> {
    label: string;
    value: number;
}

export default function InputRange({label, value, ...props}: ComponentProps) {
    return (
        <Container>
            <InputLabel>{label}</InputLabel>
            <Range defaultValue={value} {...props} />
            <InputValue>{value}</InputValue>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`;

const Range: any = styled.input.attrs({
    type: 'range',
    tabIndex: 1,
})`
    width: 200px;
    -webkit-appearance: none;
    background: transparent;
    &:focus {
        outline: none;
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 4px solid #0f141a;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        margin-top: -5px;
    }
    &:focus::-webkit-slider-thumb {
        background: #c169db;
    }
    &::-moz-range-thumb {
        -webkit-appearance: none;
        border: 4px solid #0f141a;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
    }
    &:focus::-moz-range-thumb {
        background: #c169db;
    }
    &::-ms-thumb {
        -webkit-appearance: none;
        border: 4px solid #0f141a;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
    }
    &:focus::-ms-thumb {
        background: #c169db;
    }
    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        cursor: pointer;
        background: #5b6b7d;
    }
    &::-moz-range-track {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        cursor: pointer;
        background: #5b6b7d;
    }
    &::-ms-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        border-width: 16px 0;
        color: transparent;
    }
    &::-ms-fill-lower {
        background: #2a6495;
        border: 0.2px solid #010101;
        border-radius: 2.6px;
        box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
    }
    &::-ms-fill-upper {
        background: #3071a9;
        border: 0.2px solid #010101;
        border-radius: 2.6px;
        box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;
    }
`;

const InputLabel = styled.div`
    width: 60px;
    text-align: right;
    font-size: 11px;
    line-height: 11px;
    margin-right: 10px;
    color: #bac7d6;
`;

const InputValue = styled.div`
    margin-left: 10px;
    font-size: 14px;
    font-weight: 700;
    width: 60px;
`;