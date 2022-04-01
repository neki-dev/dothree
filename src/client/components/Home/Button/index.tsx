import React, { MouseEventHandler } from 'react';
import { Container } from './styled';

type ComponentProps = {
  children: React.ReactChild | React.ReactChildren
  name: string
  onClick?: MouseEventHandler
};

export default function Button({ onClick, name, children }: ComponentProps) {
  return (
    <Container onClick={onClick} data-testid={name}>{children}</Container>
  );
}

Button.defaultProps = {
  onClick: undefined,
};
