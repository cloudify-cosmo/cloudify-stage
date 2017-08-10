/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Manager from '../utils/Manager';
import {reloadUserAppData} from './userApp';
import {clearContext} from './context';
import {selectHomePage} from './page';

function requestTenants() {
    return {
        type: types.REQ_TENANTS
    }
}

function recieveTenants(tenants) {
    return {
        type: types.RES_TENANTS,
        tenants,
        receivedAt: Date.now()
    }
}

function errorTenants(err) {
    return {
        type: types.ERR_TENANTS,
        error: err,
        receivedAt: Date.now()
    }
}

export function getTenants (manager) {
    var managerAccessor = new Manager(manager);
    return function(dispatch) {

        dispatch(requestTenants());
        return managerAccessor.doGet('/tenants',{_include:'name'})
            .then((tenants)=>{
                dispatch(recieveTenants(tenants));
            }).catch((err)=>{
                console.error(err);
                dispatch(errorTenants(err.message));
            });
    }
}

export function selectTenant (tenantName) {
    return {
        type: types.SELECT_TENANT,
        tenant: tenantName
    }
}

export function changeTenant (tenantName) {
    return function(dispatch) {
        dispatch(clearContext());
        dispatch(selectTenant(tenantName));
        dispatch(selectHomePage());
        dispatch(reloadUserAppData());
    }
}