/* eslint-disable import/no-extraneous-dependencies */
import { render as defaultRender } from '@testing-library/react';
import React, { JSXElementConstructor, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { SocketContext } from '~context/SocketContext';

import { socket } from './socket';

type RenderOptions = {
  router?: boolean
  socket?: boolean
};

export function render(component: JSX.Element, options: RenderOptions = {}) {
  function Wrapper({ children }: {
    children: ReactElement<any, string | JSXElementConstructor<any>>
  }) {
    let content = children;

    if (options.socket) {
      const fakeSocket = socket as unknown as Socket;

      content = (
        <SocketContext.Provider value={fakeSocket}>
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
