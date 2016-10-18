/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './components/layout/Layout';
import Home from './components/Home';
import NotFound from './components/NotFound';

import SetManager from './containers/SetManager';


export default (store)=> {
    const isManagerDefined = (nextState, replace, callback) => {
        if (!store.getState().managers.items || store.getState().managers.items.length === 0) {
            replace('/manager')
        }
        callback();
    };

    return (
        <Route>
            <Route path='/manager' component={SetManager}/>
            <Route path="/" component={Layout}>
                <Route path='/page/(:pageId)' component={Home} onEnter={isManagerDefined}/>
                <Route path="404" component={NotFound}/>
                <IndexRoute component={Home} params={{pageId:0}} onEnter={isManagerDefined}/>
                <Redirect from="*" to="404"/>
            </Route>
        </Route>
    );


};
