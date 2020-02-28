/**
 * Created by kinneretzin on 29/08/2016.
 */

import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import throttle from 'lodash/throttle';
import StatePersister from './utils/StatePersister';

import createRootReducer from './reducers';

export default (history, config) => {
    let initialState = StatePersister.load(config.mode);

    const hasInitState = initialState !== undefined;
    if (!hasInitState) {
        initialState = {
            context: {},
            manager: {}
        };
    }
    initialState = { ...initialState, config };

    // Clear login error if has any
    initialState.manager.err = null;
    initialState.manager.isLoggingIn = false;

    const store = createStore(
        createRootReducer(history),
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
    );

    // This saves the manager data in the local storage. This is good for when a user refreshes the page we can know if he is logged in or not, and save his login info - ip, username
    store.subscribe(
        throttle(() => {
            StatePersister.save(store.getState(), config.mode);
        }, 1000)
    );

    return store;
};
