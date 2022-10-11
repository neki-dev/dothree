import React, { MouseEventHandler } from 'react';

import { Container } from './styled';

type ComponentProps = {
  name: string
  onClick?: MouseEventHandler
  children: string
};

export function Button({ onClick, name, children }: ComponentProps) {
  return (
    <Container onClick={onClick} data-testid={name}>{children}</Container>
  );
}

Button.defaultProps = {
  onClick: undefined,
};
