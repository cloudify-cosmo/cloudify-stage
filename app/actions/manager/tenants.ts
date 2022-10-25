import log from 'loglevel';
import type { Action, AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';
import Manager from '../../utils/Manager';
import { setAppLoading } from '../appState';
import { setEditMode } from '../config';
import { clearContext } from '../context';
import { reloadUserAppData } from '../userApp';
import type { ReduxState } from '../../reducers';

// TODO(RD-5591): Refactor this to store { names: string[] } instead of { items: { name: string }[] }
type Tenants = { items: { name: string }[] };
export type RequestTenantsAction = Action<ActionType.REQ_TENANTS>;
export type RecieveTenantsAction = PayloadAction<{ tenants: Tenants; receivedAt: number }, ActionType.RES_TENANTS>;
export type ErrorTenantsAction = PayloadAction<{ error: any; receivedAt: number }, ActionType.ERR_TENANTS>;
export type SelectTenantAction = PayloadAction<string, ActionType.SELECT_TENANT>;
export type TenantAction = RequestTenantsAction | RecieveTenantsAction | ErrorTenantsAction | SelectTenantAction;

function requestTenants(): RequestTenantsAction {
    return {
        type: ActionType.REQ_TENANTS
    };
}

function recieveTenants(tenants: Tenants): RecieveTenantsAction {
    return {
        type: ActionType.RES_TENANTS,
        payload: { tenants, receivedAt: Date.now() }
    };
}

function errorTenants(error: any): ErrorTenantsAction {
    return {
        type: ActionType.ERR_TENANTS,
        payload: {
            error,
            receivedAt: Date.now()
        }
    };
}

export function getTenants(): ThunkAction<Promise<Tenants>, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        dispatch(requestTenants());
        const managerAccessor = new Manager(getState().manager);
        return managerAccessor
            .doGet('/tenants', { params: { _include: 'name', _get_all_results: true } })
            .then(tenants => {
                dispatch(recieveTenants(tenants));
                return tenants;
            })
            .catch(err => {
                log.error(err);
                dispatch(errorTenants(err.message));
                return Promise.reject(err);
            });
    };
}

export function selectTenant(tenantName: string): SelectTenantAction {
    return {
        type: ActionType.SELECT_TENANT,
        payload: tenantName
    };
}

export function changeTenant(tenantName: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return dispatch => {
        dispatch(setAppLoading(true));
        dispatch(setEditMode(false));
        dispatch(clearContext());
        dispatch(selectTenant(tenantName));
        dispatch(reloadUserAppData());
    };
}
