import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './components/App';
import PageLobby from './components/Lobby';
import PageHome from './components/Home';

ReactDOM.render(
    <BrowserRouter>
        <App>
            <Switch>
                <Route exact path="/" component={PageHome} />
                <Route exact path="/game/:uuid" component={PageLobby} />
            </Switch>
        </App>
    </BrowserRouter>,
    document.getElementById('app')
);