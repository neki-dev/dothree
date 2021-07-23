import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
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

export {GlobalStyle};