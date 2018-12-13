/**
 * Created by kinneretzin on 29/08/2016.
 */

import thunkMiddleware from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import StatePersister from './utils/StatePersister';
import throttle from 'lodash/throttle';

import reducers from './reducers';

export default (history,config) => {

    let initialState = StatePersister.load(config.mode);

    let hasInitState = initialState !== undefined;
    if (!hasInitState) {
        initialState = {
            context: {},
            manager: {}
        }
    }
    initialState = Object.assign({},initialState,{config});

    // Clear login error if has any
    initialState.manager.err = null;
    initialState.manager.isLoggingIn = false;

    let store = createStore(
        connectRouter(history)(reducers),
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
    );

    // This saves the manager data in the local storage. This is good for when a user refreshes the page we can know if he is logged in or not, and save his login info - ip, username
    store.subscribe(throttle(()=>{StatePersister.save(store.getState(),config.mode);},1000));

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const newReducers = require('./reducers');
            store.replaceReducer(newReducers);
        })
    }

    return store;
};


