import styled from 'styled-components';
import {COLOR_PLAYER} from '../Lobby/World/Entity/styled';

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px;
`;

const Logotype: any = styled.div`
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &:hover {
        cursor: pointer;
    }
`;

Logotype.Blocks = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

Logotype.Block = styled.div.attrs(() => ({
    index: Math.floor(Math.random() * 5),
}))<{
    index: number
}>`
    width: 42px;
    height: 42px;
    border-radius: 8%;
    background: ${(p) => COLOR_PLAYER[p.index]};
    &:not(:last-child) {
        margin-right: 5px;
    }
`;

Logotype.Label = styled.div`
    font: 50px 'Bebas Neue', sans-serif;
    font-weight: 400;
    line-height: 40px;
    color: #fff;
    overflow: hidden;
`;

const ButtonCreate = styled.div.attrs({
    tabIndex: 1,
})`
    width: 210px;
    color: #fff;
    background: #684473;
    padding: 18px;
    border-radius: 3px;
    text-align: center;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.1s ease-in;
    &:hover {
        cursor: pointer;
        background: #ff5d00;
    }
    &:focus {
        background: #c169db;
    }
`;

const Footer = styled.div`
    height: 31px;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    > *:not(:last-child) {
        margin-right: 5px;
    }
`;

export {Container, Logotype, ButtonCreate, Footer};