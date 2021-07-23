import styled, {css} from 'styled-components';

const Container = styled.div`
    background: #19222D;
    padding: 23px 35px 27px 35px;
    display: flex;
    align-items: center;
`;

const Block: any = styled.div`
    &:not(:last-child) {
        margin-right: 35px;
    }
`;

Block.Label = styled.div`
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 1px;
    height: 11px;
    color: rgba(255, 255, 255, 0.6);
`;

Block.Value = styled.div`
    display: flex;
    align-items: center;
`;

const Player: any = styled.div<{
    slot: number
}>`
    min-width: 32px;
    max-width: 32px;
    min-height: 32px;
    max-height: 32px;
    border-radius: 8%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(p) => {
        switch (p.slot) {
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

Player.SelfLabel = styled.span`
    text-transform: uppercase;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    padding: 2px 3px;
    font-size: 9px;
    border-radius: 3px;
`;

const EmptySlot = styled.div`
    background: #aaa;
    width: 8px;
    height: 8px;
    margin: 8px;
    border-radius: 4px;
    &:not(:last-child) {
        margin-right: 5px;
    }
`;

const RestartMessage = styled.div`
    display: inline-block;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
`;

const WinMessage = styled.div`
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    margin-right: 15px;
`;

export {Container, Block, Player, EmptySlot, RestartMessage, WinMessage};