/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './components/layout/Layout';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './containers/Login';
import {setValue} from './actions/context';
import Auth from './utils/auth';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        if (!Auth.isLoggedIn(store.getState().manager)) {
            console.log('User is not logged in, navigating to Login screen');
            replace('/login');
        }

        callback();
    };

    let setDrilldownContext = (nextState,replace,callback)=>{
        var contextParams = nextState.location.query;

        if (!_.isEmpty(contextParams)){
            _.each(contextParams,(value,key)=>{
               store.dispatch(setValue(key,value));
            });
        }

        callback();
    };

    return (
        <Route>
            <Route path='/login' component={Login}/>
            <Route path="/" component={Layout} onEnter={isLoggedIn}>
                <Route path='/page/(:pageId)/(:pageName)' component={Home} onEnter={setDrilldownContext}/>
                <Route path='/page/(:pageId)' component={Home} onEnter={setDrilldownContext}/>
                <Route path="404" component={NotFound}/>
                <IndexRoute component={Home} params={{pageId:0}}/>
                <Redirect from="*" to="404"/>
            </Route>
        </Route>
    );


};
