import styled, {css, keyframes} from 'styled-components';

const AnimationPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const Timeleft: any = styled.div<{
    danger: boolean
}>`
  font-size: 16px;
  margin-left: 10px;
  color: ${(p) => (p.danger ? '#ffbb00' : '#5b6b7d')};
  animation: ${(p) => (p.danger ? css`1s linear ${AnimationPulse}` : 'none')};
`;

export {Timeleft};