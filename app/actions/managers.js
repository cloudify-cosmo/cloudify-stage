/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Auth from '../utils/auth';
import { push } from 'react-router-redux';
import Manager from '../utils/Manager';
import {clearContext} from './context';

function requestLogin() {
    return {
        type: types.REQ_LOGIN
    }
}

function receiveLogin(ip,username,role,token,apiVersion,serverVersion,tenants) {
    return {
        type: types.RES_LOGIN,
        ip,
        username,
        role,
        token,
        apiVersion,
        serverVersion,
        tenants,
        receivedAt: Date.now()
    }
}

function errorLogin(ip,username,err) {
    return {
        type: types.ERR_LOGIN,
        ip,
        username,
        error: err,
        receivedAt: Date.now()
    }
}

export function login (ip,username,password) {
    return function (dispatch) {
        dispatch(requestLogin());
        return Auth.login(ip,username,password)
                    .then(data => {
                        dispatch(receiveLogin(ip, username, data.role, data.token, data.apiVersion, data.serverVersion, data.tenants));
                        dispatch(push('/'));
                    })
                    .catch(err => dispatch(errorLogin(ip,username,err)));
    }
}

function doLogout(err) {
    return {
        type: types.LOGOUT,
        error: err,
        receivedAt: Date.now()
    }
}
export function logout(err) {
    return function(dispatch) {
        dispatch(clearContext());
        dispatch(doLogout(err));
        dispatch(push('/login'));
    }
}

export function setStatus(status, maintenance, services) {
    return {
        type: types.SET_MANAGER_STATUS,
        status,
        maintenance,
        services,
        receivedAt: Date.now()
    }
}

export function getStatus (manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return Promise.all([managerAccessor.doGet('/status'), managerAccessor.doGet('/maintenance')])
            .then((data)=>{
                var services = _.filter(data[0].services, item => !_.isEmpty(item.instances));
                dispatch(setStatus(data[0].status, data[1].status, services));
            }).catch((err)=>{
                console.error(err);
                dispatch(setStatus('Error'));
            });
    }
}

export function switchMaintenance(manager, activate) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doPost(`/maintenance/${activate?'activate':'deactivate'}`)
            .then((data)=>{
                dispatch(setStatus(manager.status, data.status, manager.services));
                dispatch(push(activate? '/maintenance' : '/'));
            });
    }
}

export function setActiveExecutions(activeExecutions) {
    return {
        type: types.SET_ACTIVE_EXECUTIONS,
        activeExecutions
    }
}

export function getActiveExecutions(manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doGet('/executions?_include=id,workflow_id,status,deployment_id',
                                     {status: ['pending', 'started', 'cancelling', 'force_cancelling']})
            .then((data)=>{
                dispatch(setActiveExecutions(data));
            });
    }
}

export function cancelExecution(execution, action) {
    return {
        type: types.CANCEL_EXECUTION,
        execution,
        action
    }
}

export function doCancelExecution(manager, execution, action) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        return managerAccessor.doPost(`/executions/${execution.id}`, null,
                                      {deployment_id: execution.deployment_id, action})
            .then(()=>{
                dispatch(cancelExecution(execution, action));
            });
    }
}
