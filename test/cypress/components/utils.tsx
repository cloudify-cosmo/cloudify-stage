import type { ReactNode } from 'react';
import React from 'react';
import { mount } from 'cypress/react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from 'app/reducers';
import { Router } from 'react-router';

// eslint-disable-next-line import/prefer-default-export
export function mountWithProvider(component: ReactNode, initialState?: Record<string, any>) {
    const history = createBrowserHistory();
    const store = createStore(
        createRootReducer(history),
        initialState,
        applyMiddleware(thunkMiddleware, routerMiddleware(history))
    );
    mount(
        <Router history={history}>
            <Provider store={store}>{component}</Provider>
        </Router>
    );
    return { store, history };
}
