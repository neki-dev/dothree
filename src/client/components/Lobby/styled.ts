import styled from 'styled-components';

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
