import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './components/App';
import Lobby from './components/Lobby';
import Home from './components/Home';

ReactDOM.render(
    <BrowserRouter>
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/game/:uuid" component={Lobby} />
            </Switch>
        </App>
    </BrowserRouter>,
    document.getElementById('app')
);