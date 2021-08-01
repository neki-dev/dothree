import styled from 'styled-components';

/** Images */

import IconInc from './icons/inc.svg';
import IconDec from './icons/dec.svg';

/** Styles */

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 13px 14px;
    border-radius: 4px;
    &:not(:last-child) {
        margin-bottom: 3px;
    }
`;

const Group = styled.div`

`;

const Controls: any = styled.div`
    display: flex;
    align-items: center;
`;

Controls.Inc = styled.div`
    background: #243345 url(${IconInc}) center center no-repeat;
    background-size: 70%;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    &:hover {
        cursor: pointer;
        background-color: #39495c;
    }
`;

Controls.Dec = styled.div`
    background: #243345 url(${IconDec}) center center no-repeat;
    background-size: 70%;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    &:hover {
        cursor: pointer;
        background-color: #39495c;
    }
`;

const Label = styled.div`
    // width: 60px;
    // text-align: right;
    font-size: 11px;
    line-height: 11px;
    margin-right: 10px;
    color: #bac7d6;
`;

const Value = styled.div<{
    small: boolean
}>`
    line-height: 11px;
    font-size: ${({small}) => (small ? '12px' : '16px')};
    font-weight: 700;
    width: 32px;
    text-align: center;
`;

export {Container, Group, Controls, Label, Value};