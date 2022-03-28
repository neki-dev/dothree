import React from 'react';
import { Normalize } from 'styled-normalize';
import { GlobalStyle } from './styled';

type ComponentProps = {
  children: React.ReactChild | React.ReactChildren
};

export default function App({ children }: ComponentProps) {
  return (
    <>
      <Normalize />
      <GlobalStyle />
      {children}
    </>
  );
}
