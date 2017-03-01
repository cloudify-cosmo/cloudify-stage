/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './containers/layout/Layout';
import Home from './containers/Home';
import NotFound from './components/NotFound';
import Login from './containers/Login';
import {setValue,clearContext} from './actions/context';
import Auth from './utils/auth';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var managerData = store.getState().manager;
        if (!Auth.isLoggedIn(managerData)) {
            console.log('User is not logged in, navigating to Login screen');
            replace('/login');
        }
        callback();
    };
    
    return (
        <Route>
            <Route path='/login' component={Login}/>
            <Route path="/" component={Layout} onEnter={isLoggedIn}>
                <Route path='/page/(:pageId)/(:pageName)' component={Home}/>
                <Route path='/page/(:pageId)' component={Home}/>
                <Route path="404" component={NotFound}/>
                <IndexRoute component={Home} params={{pageId:0}}/>
                <Redirect from="*" to="404"/>
            </Route>
        </Route>
    );


};
