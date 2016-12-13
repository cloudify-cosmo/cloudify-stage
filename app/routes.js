/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './components/layout/Layout';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './containers/Login';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var state = store.getState();
        var currentManager = state.manager;
        if (!currentManager) {
            console.log('User doesn\'t have any manager, navigating to set manager');
            replace('/login');
        } else {
            let auth = currentManager.auth;
            if (!auth || (auth.isSecured && !auth.token) ) {
                console.log('Current manager doesnt have any token assigned, navigating to login');
                replace('/login');
            }
        }
        callback();
    };

    return (
        <Route>
            <Route path='/login' component={Login}/>
            <Route path="/" component={Layout} onEnter={isLoggedIn}>
                <Route path='/page/(:pageId)' component={Home}/>
                <Route path="404" component={NotFound}/>
                <IndexRoute component={Home} params={{pageId:0}}/>
                <Redirect from="*" to="404"/>
            </Route>
        </Route>
    );


};
