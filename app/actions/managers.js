/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Auth from '../utils/auth';
import { push } from 'react-router-redux';

function requestLogin() {
    return {
        type: types.REQ_LOGIN
    }
}

function receiveLogin(ip,username,token) {
    return {
        type: types.RES_LOGIN,
        ip,
        username,
        token,
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
            .then(data => { dispatch(receiveLogin(ip,username,data)); dispatch(push('/'));})
            .catch(err => dispatch(errorLogin(ip,username,err)))
    }
}
