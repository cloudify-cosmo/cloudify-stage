/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Auth from '../utils/auth';
import { push } from 'react-router-redux';
import CommonUtils from '../utils/commonUtils';
import config from '../config.json';

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

        return Auth.getApiVersion(ip,username,password)
            .then(version => {

                Auth.getLoginToken(ip,username,password,version)
                    .then(token => {
                        dispatch(receiveLogin(ip, username, token, version));
                        dispatch(push('/'));
                    })
                    .catch(err => dispatch(errorLogin(ip,username,err)))

            })
            .catch(err => dispatch(errorLogin(ip,username,err)))
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
    return function(dispatch) {
        return fetch(CommonUtils.createManagerUrl(config.proxyIp, manager.ip, '/api/v2.1/status'),
            {
                method: 'GET',
                headers: (manager.auth.isSecured && manager.auth.token ? {"Authentication-Token": manager.auth.token} : undefined)
            })
            .then(response => response.json())
            .catch((e)=>{
                console.error(e);
                dispatch(setStatus('Error'));
            })
            .then((data)=> {
                if (data.error_code) {
                    dispatch(setStatus('Error'));
                    return;
                }

                dispatch(setStatus(data.status));
            });


    }
}
