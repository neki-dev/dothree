import React from "react";

import { Container } from "./styled";

import type { MouseEventHandler } from "react";

type Props = {
  onClick?: MouseEventHandler;
  children: string;
};

export const Button: React.FC<Props> = ({ onClick, children }) => (
  <Container onClick={onClick}>{children}</Container>
);
