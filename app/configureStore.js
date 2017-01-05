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

import {createPageFromInitialTemplate} from './actions/page';

export default (history,templates,plugins) => {

    let initialState = StatePersister.load();

    let hasInitState = initialState !== undefined;
    if (!hasInitState) {
        initialState = {
            context: {},
            manager: {},
            templates: templates,
            plugins: plugins
        }
    } else {
        initialState = Object.assign({},initialState,{
            templates: templates,
            plugins: plugins
        });
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

    // If needed add the initial pages/widgets from the template
    if (!hasInitState) {
        store.dispatch(createPageFromInitialTemplate(initialTemplate,templates,plugins));
    }

    store.subscribe(throttle(()=>{StatePersister.save(store.getState());},1000));

    return store;
};


