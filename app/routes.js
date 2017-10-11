/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './containers/layout/Layout';
import Home from './containers/Home';
import TemplateManagement from './Containers/templates/TemplateManagement';
import PageManagement from './Containers/templates/PageManagement';
import NotFound from './components/NotFound';
import LogoPage from './components/LogoPage';
import Login from './containers/Login';
import MaintenanceMode from './containers/maintenance/MaintenanceModePageMessage';
import NoTenants from './containers/NoTenants';
import ErrorPage from './Containers/ErrorPage';

import {setValue,clearContext} from './actions/context';
import Auth from './utils/auth';
import Consts from './utils/consts';

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var managerData = store.getState().manager;
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        if (managerData.maintenance === Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is on maintenance mode, navigating to maintenance page');
            replace('maintenance');
        }

        callback();
    };

    let isInMaintenanceMode = (nextState, replace, callback)=>{
        var managerData = store.getState().manager;

        // This is only relevant if the user is logged in
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        // Only stay here if we are in maintenance mode
        if (managerData.maintenance !== Consts.MAINTENANCE_ACTIVATED) {
            console.log('Manager is NOT on maintenance mode, navigating to main page');
            replace('/');
        }

        callback();
    };

    let isTemplateManagementAuthorized = (nextState, replace, callback)=>{
        var managerData = store.getState().manager;

        // This is only relevant if the user is logged in
        if (!Auth.isLoggedIn()) {
            console.log('User is not logged in, navigating to Login screen');
            replace('login');
        }

        // Only stay here if user roles match required permissions
        if (!Auth.isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, managerData)){
            console.log('Manager has NOT an admin role, navigating to main page');
            replace('/');
        }

        callback();
    };

    let pageManagementEnter = (nextState, replace, callback)=>{
        isTemplateManagementAuthorized(nextState, replace, () => {
            var templateManagement = store.getState().templateManagement;

            if (!templateManagement.page) {
                replace('template_management');
            }

            callback();
        });
    };

    let redirectToPortal = () => {
        window.location = store.getState().config.app.saml.portalUrl;
    };

    let redirectToSSO = () => {
        window.location = store.getState().config.app.saml.ssoUrl;
    };

    return (
        <Route path='/'>
            <Route component={LogoPage}>
                {store.getState().config.app.saml.enabled
                    ?
                    [
                        <Route key='loginRoute' path='login' onEnter={redirectToSSO}/>,
                        <Route key='logoutRoute' path='logout' onEnter={redirectToPortal}/>
                    ]
                    :
                    [
                        <Route key='loginRoute' path='login' component={Login}/>,
                        <Redirect key='logoutRoute' from='logout' to='login'/>
                    ]
                }
                <Route path='error' component={ErrorPage}/>
                <Route path='noTenants' component={NoTenants}/>
            </Route>
            <Route path='maintenance' component={MaintenanceMode} onEnter={isInMaintenanceMode}/>
            <Route component={Layout} onEnter={isLoggedIn}>
                <Route path='page/(:pageId)' component={Home}/>
                <Route path='page/(:pageId)/(:pageName)' component={Home}/>
                <Route path='template_management' component={TemplateManagement} onEnter={isTemplateManagementAuthorized}/>
                <Route path='page_management' component={PageManagement} onEnter={pageManagementEnter}/>
                <Route path='404' component={NotFound}/>
                <IndexRoute component={Home}/>
                <Redirect from="*" to='404'/>
            </Route>
        </Route>
    );


};
