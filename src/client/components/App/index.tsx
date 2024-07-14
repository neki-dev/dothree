import React from "react";
import { Normalize } from "styled-normalize";

import { GlobalStyle } from "./styled";

type Props = {
  children: React.ReactElement;
};

export const App: React.FC<Props> = ({ children }) => (
  <>
    <Normalize />
    <GlobalStyle />
    {children}
  </>
);
