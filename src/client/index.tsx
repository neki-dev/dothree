import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { SocketProvider } from '~context/SocketContext';

import { App } from './components/App';
import { Home } from './components/Home';
import { Lobby } from './components/Lobby';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route
          exact path="/" component={() => (
            <SocketProvider namespace="/home">
              <Home />
            </SocketProvider>
          )}
        />
        <Route
          exact path="/game/:uuid" component={() => (
            <SocketProvider namespace="/lobby">
              <Lobby />
            </SocketProvider>
          )}
        />
      </Switch>
    </App>
  </BrowserRouter>,
  document.getElementById('app'),
);
