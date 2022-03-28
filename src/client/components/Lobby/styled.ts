import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const GameScreen = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  justify-content: center;
  flex: 1;
  overflow: hidden;
`;

export const Error: any = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background: #c92929;
  height: 100%;
`;

Error.Message = styled.span`
  max-width: 30%;
  color: #fff;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
`;

export const WaitingOverlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #0f141a;
  z-index: 999;
  flex-direction: column;
`;

export const Loading: any = styled.div`
  margin-bottom: 50px;
`;

export const AnimationJumping = keyframes`
  0%, 100% {
      transform: translate(0, 0);
  }
  50% {
      transform: translate(0, 22px);
  }
`;

Loading.Block = styled.div<{
  slot: number
  empty: boolean
}>`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 8%;
  margin: 8px;
  animation: 0.8s linear infinite ${AnimationJumping};
  background: ${(p) => {
    if (p.empty) {
      return css`rgba(255, 255, 255, 0.5)`;
    }
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
      default:
        return css`none`;
    }
  }};
  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
  &:nth-child(4) {
    animation-delay: 0.4s;
  }
  &:nth-child(5) {
    animation-delay: 0.5s;
  }
`;

export const Status: any = styled.div`
  margin-top: 10px;
  align-items: center;
  display: flex;
`;

Status.String = styled.div`
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 200;
  opacity: 0.5;
  &:not(:last-child) {
    margin-right: 15px;
  }
`;

Status.Number = styled.div`
  text-transform: uppercase;
  font-size: 32px;
  font-weight: bold;
  opacity: 0.9;
  margin-top: -1px;
  &:not(:last-child) {
    margin-right: 15px;
  }
`;
