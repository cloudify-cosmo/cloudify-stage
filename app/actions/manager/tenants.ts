import log from 'loglevel';
import type { Action } from 'redux';
import type { PaginatedResponse } from 'backend/types';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import Manager from '../../utils/Manager';
import type { SetAppLoadingAction } from '../app';
import { setAppLoading } from '../app';
import type { SetConfigEditModeAction } from '../config';
import { setEditMode } from '../config';
import type { ClearContextAction } from '../context';
import { clearContext } from '../context';
import { reloadUserAppData } from '../userApp';

export type Tenants = string[];
export type FetchTenantsRequestAction = Action<ActionType.FETCH_TENANTS_REQUEST>;
export type FetchTenantsSuccessAction = PayloadAction<
    { tenants: Tenants; receivedAt: number },
    ActionType.FETCH_TENANTS_SUCCESS
>;
export type FetchTenantsFailureAction = PayloadAction<
    { error: any; receivedAt: number },
    ActionType.FETCH_TENANTS_FAILURE
>;
export type SelectTenantAction = PayloadAction<string, ActionType.SELECT_TENANT>;
export type TenantAction =
    | FetchTenantsRequestAction
    | FetchTenantsSuccessAction
    | FetchTenantsFailureAction
    | SelectTenantAction;

function fetchTenantsRequest(): FetchTenantsRequestAction {
    return {
        type: ActionType.FETCH_TENANTS_REQUEST
    };
}

function fetchTenantsSuccess(tenants: Tenants): FetchTenantsSuccessAction {
    return {
        type: ActionType.FETCH_TENANTS_SUCCESS,
        payload: { tenants, receivedAt: Date.now() }
    };
}

function fetchTenantsFailure(error: any): FetchTenantsFailureAction {
    return {
        type: ActionType.FETCH_TENANTS_FAILURE,
        payload: {
            error,
            receivedAt: Date.now()
        }
    };
}

export function getTenants(): ReduxThunkAction<
    Promise<Tenants>,
    FetchTenantsRequestAction | FetchTenantsSuccessAction | FetchTenantsFailureAction
> {
    type GetTenantsResponse = PaginatedResponse<{ name: string }>;
    return (dispatch, getState) => {
        dispatch(fetchTenantsRequest());
        const managerAccessor = new Manager(getState().manager);
        return managerAccessor
            .doGet<GetTenantsResponse>('/tenants', { params: { _include: 'name', _get_all_results: true } })
            .then(response => {
                const tenants = response.items.map(item => item.name);
                dispatch(fetchTenantsSuccess(tenants));
                return tenants;
            })
            .catch(err => {
                log.error(err);
                dispatch(fetchTenantsFailure(err.message));
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

export function changeTenant(
    tenantName: string
): ReduxThunkAction<void, SetAppLoadingAction | SetConfigEditModeAction | ClearContextAction | SelectTenantAction> {
    return dispatch => {
        dispatch(setAppLoading(true));
        dispatch(setEditMode(false));
        dispatch(clearContext());
        dispatch(selectTenant(tenantName));
        dispatch(reloadUserAppData());
    };
}
