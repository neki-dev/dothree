import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {Normalize} from 'styled-normalize';

interface ComponentProps {
    children: any;
}

export default function App({children}: ComponentProps) {
    return (
        <>
            <Normalize/>
            <GlobalStyle/>
            {children}
        </>
    );
}

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;400&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

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
  }

  #app {
    display: flex;
    flex-direction: column;
  }
`;