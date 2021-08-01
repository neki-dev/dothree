import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {SocketProvider} from '~context/SocketContext';
import App from './components/App';
import PageLobby from './components/Lobby';
import PageHome from './components/Home';

ReactDOM.render(
    <BrowserRouter>
        <App>
            <Switch>
                <Route exact path="/" component={() => (
                    <SocketProvider namespace="/home">
                        <PageHome />
                    </SocketProvider>
                )} />
                <Route exact path="/game/:uuid" component={() => (
                    <SocketProvider namespace="/lobby">
                        <PageLobby />
                    </SocketProvider>
                )} />
            </Switch>
        </App>
    </BrowserRouter>,
    document.getElementById('app')
);