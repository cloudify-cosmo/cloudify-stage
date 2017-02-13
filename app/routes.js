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
import {getTenants} from './actions/tenants';
import {logout} from './actions/managers';
import {loadOrCreateUserAppData} from './actions/userApp';

import StatusPoller from './utils/StatusPoller';
import UserAppDataAutoSaver from './utils/UserAppDataAutoSaver';

var isFirstTimeLoadingWhenLoggedIn = true;

function _load(managerData,store) {
    return new Promise((resolve,reject)=>{
        store.dispatch(getTenants(managerData)).then(()=>{
            var state = store.getState();
            if (state.manager.tenants.items.length === 0) {
                console.log('User is not attached to any tenant, cannot login');
                return reject('User is not attached to any tennat, cannot login');
            }

            //// Stopping the auto saver , cause the loadOrCreateUserAppData creates a page initiating alot of state change, and at the end it saves the data. So no need
            //// for the auto saver to work
            //UserAppDataAutoSaver.getAutoSaver().stop();
            store.dispatch(loadOrCreateUserAppData(state.manager,state.config,state.templates,state.widgetDefinitions))
                .then(()=>{
                    resolve();
                })
                .catch((e)=>{
                    console.log('Error initializing user data. Cannot load page',e);
                    reject('Error initializing user data, cannot load page')
                });
        });
    });

}

export default (store)=> {
    let isLoggedIn = (nextState, replace, callback) => {
        var managerData = store.getState().manager;
        if (!Auth.isLoggedIn(managerData)) {
            console.log('User is not logged in, navigating to Login screen');
            replace('/login');
            callback();
        } else if (isFirstTimeLoadingWhenLoggedIn) {
            console.log('First time logging in , fetching shit');
            _load(managerData,store).then(()=>{
                isFirstTimeLoadingWhenLoggedIn = false;

                // Starting poller (if its not started yet - user refreshed the page, and he is already logged in, so login didnt run)
                StatusPoller.getPoller().start();
                UserAppDataAutoSaver.getAutoSaver().start();

                callback();
            }).catch((e)=>{
                store.dispatch(logout(e));
                replace('/login');
                callback();
            });
        } else {
            callback();
        }

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

    let ensureLoggedOut = (nextState,replace,callback)=>{
        isFirstTimeLoadingWhenLoggedIn = true;

        StatusPoller.getPoller().stop();
        UserAppDataAutoSaver.getAutoSaver().stop();

        callback();
    };

    return (
        <Route>
            <Route path='/login' component={Login} onEnter={ensureLoggedOut}/>
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
