import { push } from 'connected-react-router';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';
import type { ReduxState } from '../../reducers';
import Manager from '../../utils/Manager';
import Consts from '../../utils/consts';
import ExecutionUtils from '../../utils/shared/ExecutionUtils';

// TODO: move CancelAction to ExecutionUtils?
type CancelAction = 'cancel' | 'force_cancel' | 'kill';

export type SetMaintenanceStatusAction = PayloadAction<string, ActionType.SET_MAINTENANCE_STATUS>;
export type SetActiveExecutionsAction = PayloadAction<
    { status: string; receivedAt: number },
    ActionType.SET_ACTIVE_EXECUTIONS
>;
export type CancelExecutionAction = PayloadAction<
    { execution: any; action: CancelAction },
    ActionType.CANCEL_EXECUTION
>;

export type MaintenanceAction = SetMaintenanceStatusAction | SetActiveExecutionsAction | CancelExecutionAction;

export function setMaintenanceStatus(status: string): SetMaintenanceStatusAction {
    return {
        type: ActionType.SET_MAINTENANCE_STATUS,
        payload: status
    };
}

export function getMaintenanceStatus(manager: ReduxState['manager']): ThunkAction<void, ReduxState, never, AnyAction> {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor
            .doGet('/maintenance')
            .then(data => {
                dispatch(setMaintenanceStatus(data.status));
            })
            .catch(err => {
                log.error(err);
            });
}

export function switchMaintenance(
    manager: ReduxState['manager'],
    activate: boolean
): ThunkAction<void, ReduxState, never, AnyAction> {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor.doPost(`/maintenance/${activate ? 'activate' : 'deactivate'}`).then(data => {
            dispatch(setMaintenanceStatus(data.status));
            dispatch(push(activate ? Consts.PAGE_PATH.MAINTENANCE : Consts.PAGE_PATH.HOME));
        });
}

// TODO: Add better typing
export function setActiveExecutions(activeExecutions: any): SetActiveExecutionsAction {
    return {
        type: ActionType.SET_ACTIVE_EXECUTIONS,
        payload: activeExecutions
    };
}

export function getActiveExecutions(manager: ReduxState['manager']): ThunkAction<void, ReduxState, never, AnyAction> {
    const managerAccessor = new Manager(manager);

    return dispatch => {
        const maintenanceModeActivationBlockingStatuses = [
            ...ExecutionUtils.WAITING_EXECUTION_STATUSES,
            ...ExecutionUtils.ACTIVE_EXECUTION_STATUSES
        ];
        return managerAccessor
            .doGet('/executions?_include=id,workflow_id,status,status_display,blueprint_id,deployment_id', {
                params: {
                    status: maintenanceModeActivationBlockingStatuses
                }
            })
            .then(data => {
                dispatch(setActiveExecutions(data));
            });
    };
}

// TODO: Add better typing
export function cancelExecution(execution: any, action: CancelAction): CancelExecutionAction {
    return {
        type: ActionType.CANCEL_EXECUTION,
        payload: { execution, action }
    };
}

// TODO: Add better typing
export function doCancelExecution(
    manager: ReduxState['manager'],
    execution: any,
    action: CancelAction
): ThunkAction<void, ReduxState, never, AnyAction> {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor
            .doPost(`/executions/${execution.id}`, { body: { deployment_id: execution.deployment_id, action } })
            .then(() => {
                dispatch(cancelExecution(execution, action));
            });
}
