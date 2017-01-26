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

import {createPageFromInitialTemplate} from './actions/page';

export default (history,templates,widgetDefinitions,config) => {

    let initialState = StatePersister.load(config.mode);

    let hasInitState = initialState !== undefined;
    if (!hasInitState) {
        initialState = {
            context: {},
            manager: {}
        }
    }
    initialState = Object.assign({},initialState,{
        templates,
        widgetDefinitions,
        config
    });

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
        var initialTemplateName = config.app['initialTemplate'][config.mode === 'main' ? 'admin': 'customer'];
        var initialTemplate = templates[initialTemplateName];
        store.dispatch(createPageFromInitialTemplate(initialTemplate,templates,widgetDefinitions));
    }

    store.subscribe(throttle(()=>{StatePersister.save(store.getState(),config.mode);},1000));

    return store;
};


