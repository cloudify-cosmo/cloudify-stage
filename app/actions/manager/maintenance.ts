import { push } from 'connected-react-router';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import type { ReduxState } from '../../reducers';
import Manager from '../../utils/Manager';
import Consts from '../../utils/consts';
import type { CancelAction, Execution } from '../../utils/shared/ExecutionUtils';
import ExecutionUtils from '../../utils/shared/ExecutionUtils';
import type { PaginatedResponse } from '../../../backend/types';

type ActiveExecutions = PaginatedResponse<
    Required<Pick<Execution, 'id' | 'workflow_id' | 'status' | 'status_display' | 'blueprint_id' | 'deployment_id'>>
>;

export type SetMaintenanceStatusAction = PayloadAction<string, ActionType.SET_MAINTENANCE_STATUS>;
export type SetActiveExecutionsAction = PayloadAction<ActiveExecutions, ActionType.SET_ACTIVE_EXECUTIONS>;
export type SetCancelExecutionAction = PayloadAction<
    { execution: Execution; action: CancelAction },
    ActionType.SET_CANCEL_EXECUTION
>;

export type MaintenanceAction = SetMaintenanceStatusAction | SetActiveExecutionsAction | SetCancelExecutionAction;

function setMaintenanceStatus(status: string): SetMaintenanceStatusAction {
    return {
        type: ActionType.SET_MAINTENANCE_STATUS,
        payload: status
    };
}

export function getMaintenanceStatus(manager: ReduxState['manager']): ReduxThunkAction {
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

export function switchMaintenance(manager: ReduxState['manager'], activate: boolean): ReduxThunkAction {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor.doPost(`/maintenance/${activate ? 'activate' : 'deactivate'}`).then(data => {
            dispatch(setMaintenanceStatus(data.status));
            dispatch(push(activate ? Consts.PAGE_PATH.MAINTENANCE : Consts.PAGE_PATH.HOME));
        });
}

export function setActiveExecutions(activeExecutions: ActiveExecutions): SetActiveExecutionsAction {
    return {
        type: ActionType.SET_ACTIVE_EXECUTIONS,
        payload: activeExecutions
    };
}

export function getActiveExecutions(manager: ReduxState['manager']): ReduxThunkAction {
    const managerAccessor = new Manager(manager);

    return dispatch => {
        const maintenanceModeActivationBlockingStatuses = [
            ...ExecutionUtils.WAITING_EXECUTION_STATUSES,
            ...ExecutionUtils.ACTIVE_EXECUTION_STATUSES
        ];
        return managerAccessor
            .doGet<ActiveExecutions>(
                '/executions?_include=id,workflow_id,status,status_display,blueprint_id,deployment_id',
                {
                    params: {
                        status: maintenanceModeActivationBlockingStatuses
                    }
                }
            )
            .then(data => {
                dispatch(setActiveExecutions(data));
            });
    };
}

function setCancelExecution(execution: Execution, action: CancelAction): SetCancelExecutionAction {
    return {
        type: ActionType.SET_CANCEL_EXECUTION,
        payload: { execution, action }
    };
}

export function cancelExecution(
    manager: ReduxState['manager'],
    execution: Execution,
    action: CancelAction
): ReduxThunkAction {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor
            .doPost(`/executions/${execution.id}`, { body: { deployment_id: execution.deployment_id, action } })
            .then(() => {
                dispatch(setCancelExecution(execution, action));
            });
}
