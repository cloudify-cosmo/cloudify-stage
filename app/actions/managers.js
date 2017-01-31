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

function receiveLogin(ip,username,role,token,version,tenants) {
    return {
        type: types.RES_LOGIN,
        ip,
        username,
        role,
        token,
        version,
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
                        dispatch(receiveLogin(ip, username, data.role, data.token, data.version,data.tenants));
                        dispatch(push('/'));
                    })
                    .catch(err => dispatch(errorLogin(ip,username,err)));
    }
}

export function logout() {
    return function(dispatch) {
        dispatch(clearContext());
        dispatch(push('/login'));
    }
}

function setStatus(status) {
    return {
        type: types.SET_MANAGER_STATUS,
        status,
        receivedAt: Date.now()
    }
}

export function getStatus (manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {
        managerAccessor.doGet('/status')
            .then((data)=>{
                dispatch(setStatus(data.status));
            }).catch((err)=>{
                console.error(err);
                dispatch(setStatus('Error'));
            });
    }
}