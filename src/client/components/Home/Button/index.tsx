import React, { MouseEventHandler } from 'react';
import { Container } from './styled';

type ComponentProps = {
  children: React.ReactChild | React.ReactChildren
  onClick?: MouseEventHandler
};

export default function Button({ onClick, children }: ComponentProps) {
  return (
    <Container onClick={onClick}>{children}</Container>
  );
}

Button.defaultProps = {
  onClick: undefined,
};
