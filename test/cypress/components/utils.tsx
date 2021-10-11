import React, { ReactNode } from 'react';
import { mount } from '@cypress/react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import createRootReducer from 'app/reducers';
import { routerMiddleware } from 'connected-react-router';

// eslint-disable-next-line import/prefer-default-export
export function mountWithProvider(component: ReactNode, initialState?: Record<string, any>) {
    const history = createBrowserHistory();
    mount(
        <Provider
            store={createStore(
                createRootReducer(history),
                initialState,
                applyMiddleware(thunkMiddleware, routerMiddleware(history))
            )}
        >
            {component}
        </Provider>
    );
}
