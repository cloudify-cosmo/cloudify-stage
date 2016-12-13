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

import initialTemplate from '../templates/initial-template.json';
import {v4} from 'node-uuid';

export default (history) => {

    let initialState = StatePersister.load();

    if (initialState === undefined) {
        initialState = {
            pages: [buildInitialTemplate()],
            context: {},
            manager: {}
        }
    }

    var store = createStore(
        reducers,
        initialState,
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            routerMiddleware(history),
            createLogger() // neat middleware that logs actions
        )
    );

    store.subscribe(throttle(()=>{StatePersister.save(store.getState());},1000));

    return store;
};

function buildInitialTemplate() {
    initialTemplate.id = "0";

    _.each(initialTemplate.widgets,(widget)=> {
        widget.id = v4();
    });

    return initialTemplate;
}

