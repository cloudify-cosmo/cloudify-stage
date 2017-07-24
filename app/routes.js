/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './containers/layout/Layout';
import Home from './containers/Home';
import NotFound from './components/NotFound';
import Login from './containers/Login';
import MaintenanceMode from './containers/maintenance/MaintenanceModePageMessage';

import {setValue,clearContext} from './actions/context';
import Auth from './utils/auth';
import Consts from './utils/consts';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var managerData = store.getState().manager;
        if (!Auth.isLoggedIn(managerData)) {
            console.log('User is not logged in, navigating to Login screen');
            replace('/login');
        }

        if (managerData.maintenance === Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is on maintenance mode, navigating to maintenance page');
            replace('/maintenance');
        }

        callback();
    };

    let isInMaintenanceMode = (nextState, replace, callback)=>{
        var managerData = store.getState().manager;

        // This is only relevant if the user is logged in
        if (!Auth.isLoggedIn(managerData)) {
            console.log('User is not logged in, navigating to Login screen');
            replace('/login');
        }

        // Only stay here if we are in maintenance mode
        if (managerData.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is NOT on maintenance mode, navigating to main page');
            replace('/');
        }

        callback();
    };

    return (
        <Route>
            <Route path='/login' component={Login}/>
            <Route path='/maintenance' component={MaintenanceMode} onEnter={isInMaintenanceMode}/>
            <Route path="/" component={Layout} onEnter={isLoggedIn}>
                <Route path='/page/(:pageId)' component={Home}/>
                <Route path='/page/(:pageId)/(:pageName)' component={Home}/>
                <Route path="404" component={NotFound}/>
                <IndexRoute component={Home}/>
                <Redirect from="*" to="404"/>
            </Route>
        </Route>
    );


};
