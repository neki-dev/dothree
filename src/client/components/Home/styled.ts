import styled from 'styled-components';

import { COLOR_PLAYER } from '../Lobby/World/Entity/styled';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  width: 460px;
  margin: 0 auto;
  @media (max-width: 460px) {
    width: 100%;
    padding: 40px;
  }
`;

export const Logotype: any = styled.div`
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

export const Footer = styled.div`
  height: 31px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  > *:not(:last-child) {
    margin-right: 5px;
  }
`;
