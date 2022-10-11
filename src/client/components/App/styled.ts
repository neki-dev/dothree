import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    outline: none;
  }
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html,
  body,
  #app {
    min-height: 100vh;
    max-height: 100vh;
  }
  body {
    font: 13px 'Nunito', sans-serif;
    background: #0F141A;
    color: #FFFFFF;
    min-width: 280px;
  }
  #app {
    display: flex;
    flex-direction: column;
  }
`;
