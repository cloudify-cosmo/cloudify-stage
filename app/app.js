/**
 * Created by kinneretzin on 29/08/2016.
 */

import 'babel-polyfill';

//import '../styles/bootstrap.min.css';
import './styles/style.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory ,useRouterHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore  from './configureStore';
import routes from './routes';

const initialState = {};
const store = configureStore(initialState,browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('app')
);