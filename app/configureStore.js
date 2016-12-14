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

export default (history,templates) => {

    let initialState = StatePersister.load();

    if (initialState === undefined) {
        initialState = {
            pages: buildInitialTemplate(templates),
            context: {},
            manager: {}
        }
    }
    initialState = Object.assign({},initialState,{
        templates: templates
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

    store.subscribe(throttle(()=>{StatePersister.save(store.getState());},1000));

    return store;
};

function buildInitialTemplate(templates) {
    let idIndex = 0;
    let initTemplate = [];

    _.each(initialTemplate,(templateName)=>{
        var template = templates[templateName];
        if (!template) {
            console.error('Cannot find template : '+templateName + ' Skipping... ');
            return;
        }

        var tpl = Object.assign({},template,{
            id:""+(idIndex++),
            widgets: _.map(template.widgets,(widget)=>{
                return Object.assign({},widget,{
                    id: v4()
                })
            })

        });

        initTemplate.push(tpl);
    });

    return initTemplate;
}

