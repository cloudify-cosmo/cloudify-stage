/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Auth from '../utils/auth';
import { push } from 'react-router-redux';
import CommonUtils from '../utils/commonUtils';
import Manager from '../utils/Manager';

function requestLogin() {
    return {
        type: types.REQ_LOGIN
    }
}

function receiveLogin(ip,username,token,version) {
    return {
        type: types.RES_LOGIN,
        ip,
        username,
        token,
        version,
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
                        dispatch(receiveLogin(ip, username, data.token, data.version));
                        dispatch(push('/'));
                    })
                    .catch(err => dispatch(errorLogin(ip,username,err)));
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
                if (data.error_code) {
                    dispatch(setStatus('Error'));
                    return;
                }

                dispatch(setStatus(data.status));
            }).catch((err)=>{
                console.error(err);
                dispatch(setStatus('Error'));
            });
    }
}
