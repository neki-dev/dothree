import styled from 'styled-components';

const Container = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Settings = styled.div`
    margin-bottom: 30px;
`;

const Actions = styled.div`
    display: flex;
`;

const ButtonCreate = styled.button.attrs({
    tabIndex: 1,
})`
    border: none;
    color: #fff;
    background: #ff5d00;
    padding: 14px 22px;
    border-radius: 3px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.1s ease-in;
    &:hover,
    &:focus {
        cursor: pointer;
        background: #684473;
    }
`;

const ButtonBack = styled.div.attrs({
    tabIndex: 1,
})`
    border: none;
    color: #fff;
    background: #5b6b7d;
    padding: 14px 22px;
    border-radius: 3px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.1s ease-in;
    margin-right: 10px;
    &:hover,
    &:focus {
        cursor: pointer;
        background: #684473;
    }
`;

export {Container, Settings, Actions, ButtonCreate, ButtonBack};