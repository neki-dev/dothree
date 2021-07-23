import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    margin-left: 70px;
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`;

const Checkbox: any = styled.input.attrs({
    type: 'checkbox',
    tabIndex: 1,
})`
    margin-right: 10px;
    height: 14px;
    width: 14px;
`;

const Label = styled.div`
    color: #bac7d6;
    line-height: 14px;
    font-size: 12px;
`;

export {Container, Checkbox, Label};