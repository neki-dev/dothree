import React from 'react';

import { Container } from './styled';

import type { MouseEventHandler } from 'react';

type Props = {
  name: string
  onClick?: MouseEventHandler
  children: string
};

export const Button: React.FC<Props> = ({ onClick, name, children }) => (
  <Container onClick={onClick} data-testid={name}>
    {children}
  </Container>
);
