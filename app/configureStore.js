/**
 * Created by kinneretzin on 29/08/2016.
 */

import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

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


    var store = createStore(
        reducers,
        initialState,
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            routerMiddleware(history),
            createLogger() // neat middleware that logs actions
        )
    );

    // This saves the manager data in the local storage. This is good for when a user refreshes the page we can know if he is logged in or not, and save his login info - ip, username
    store.subscribe(throttle(()=>{StatePersister.save(store.getState(),config.mode);},1000));

    return store;
};


