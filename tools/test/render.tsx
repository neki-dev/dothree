import React, { JSXElementConstructor, ReactElement } from 'react';
import { render as defaultRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SocketContext } from '~context/SocketContext';
import socket from './socket';

type RenderOptions = {
  router?: boolean
  socket?: boolean
};

export default function render(component: JSX.Element, options: RenderOptions = {}) {
  function Wrapper({ children }: {
    children: ReactElement<any, string | JSXElementConstructor<any>>
  }) {
    let content = children;
    if (options.socket) {
      content = (
        // @ts-ignore
        <SocketContext.Provider value={socket}>
          {content}
        </SocketContext.Provider>
      );
    }
    if (options.router) {
      content = (
        <BrowserRouter>
          {content}
        </BrowserRouter>
      );
    }
    return content;
  }

  return defaultRender(component, {
    wrapper: Wrapper,
  });
}
