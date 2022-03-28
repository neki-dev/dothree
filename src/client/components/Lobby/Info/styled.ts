import styled from 'styled-components';
import { COLOR_PLAYER } from '../World/Entity/styled';

export const Container = styled.div`
  background: #19222D;
  padding: 23px 35px 27px 35px;
  display: flex;
  align-items: center;
`;

export const Block: any = styled.div`
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

export const Player: any = styled.div<{
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
  background: ${(p) => COLOR_PLAYER[p.slot]};
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

export const EmptySlot = styled.div`
  background: #aaa;
  width: 8px;
  height: 8px;
  margin: 8px;
  border-radius: 4px;
  &:not(:last-child) {
    margin-right: 5px;
  }
`;

export const RestartMessage = styled.div`
  display: inline-block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

export const WinMessage = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  margin-right: 15px;
`;
