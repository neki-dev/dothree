import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import './styles/normalize.css';
import './styles/main.css';

import Lobby from './components/Lobby';
import Home from './components/Home';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/game/:uuid" component={Lobby}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('app')
);