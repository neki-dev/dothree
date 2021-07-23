import styled, {css} from 'styled-components';

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
    background: ${(p) => {
        switch (p.index) {
            case 0:
                return css`linear-gradient(135deg, #ffb300 0%, #ff7300 100%)`;
            case 1:
                return css`linear-gradient(135deg, #e47dff 0%, #9248a6 100%)`;
            case 2:
                return css`linear-gradient(135deg, #3dcbf0 0%, #1b86a2 100%)`;
            case 3:
                return css`linear-gradient(135deg, #f05656 0%, #b53a3a 100%)`;
            case 4:
                return css`linear-gradient(135deg, #a3e75f 0%, #5ea21b 100%)`;
        }
    }};
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