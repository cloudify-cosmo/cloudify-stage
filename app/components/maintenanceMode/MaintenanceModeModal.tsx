import { isEmpty } from 'lodash';
import log from 'loglevel';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ApproveButton,
    CancelButton,
    Checkmark,
    DataTable,
    ErrorMessage,
    Icon,
    Menu,
    Message,
    Modal,
    PopupMenu
} from '../basic';
import {
    cancelExecution,
    getActiveExecutions,
    setActiveExecutions,
    switchMaintenance
} from '../../actions/manager/maintenance';
import Consts from '../../utils/consts';
import { useBoolean, useErrors } from '../../utils/hooks';
import ExecutionUtils from '../../utils/shared/ExecutionUtils';
import type { CancelAction, Execution } from '../../utils/shared/ExecutionUtils';
import StageUtils from '../../utils/stageUtils';
import ExecutionStatus from '../common/ExecutionStatus';
import type { ReduxState } from '../../reducers';
import type { ActiveExecutions } from '../../actions/manager/maintenance';
import type { CancelablePromise } from '../../utils/types';
import type { ReduxThunkDispatch } from '../../configureStore';

const POLLING_INTERVAL = 2000;

const tConfirmModal = StageUtils.getT('maintenanceMode.confirmModal');
const tExecutions = StageUtils.composeT(tConfirmModal, 'executions');

interface MaintenanceModeModalProps {
    show: boolean;
    onHide: () => void;
}

export default function MaintenanceModeModal({ onHide, show }: MaintenanceModeModalProps) {
    const dispatch: ReduxThunkDispatch = useDispatch();
    const manager = useSelector((state: ReduxState) => state.manager);
    const activeExecutions: ActiveExecutions | null = useSelector(
        (state: ReduxState) => state.manager.activeExecutions ?? null
    );
    const onMaintenanceActivate = () => {
        return dispatch(switchMaintenance(manager, true));
    };
    const onMaintenanceDeactivate = () => {
        return dispatch(switchMaintenance(manager, false));
    };
    const onFetchActiveExecutions = () => {
        return dispatch(getActiveExecutions(manager));
    };
    const onCancelExecution = (execution: Execution, action: CancelAction) => {
        return dispatch(cancelExecution(manager, execution, action));
    };
    const onClose = () => {
        return dispatch(setActiveExecutions(null));
    };

    const [loading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    const pollingTimeout = useRef<NodeJS.Timeout | null>(null);
    const fetchDataPromise = useRef<CancelablePromise<unknown> | null>(null);

    function stopFetchingData() {
        if (fetchDataPromise.current) {
            fetchDataPromise.current.cancel();
        }
    }

    function stopPolling() {
        log.log('Stop polling maintenance data');
        if (pollingTimeout.current) {
            clearTimeout(pollingTimeout.current);
        }
    }

    function startPolling() {
        stopPolling();
        stopFetchingData();

        if (show) {
            log.log(`Polling maintenance data - time interval: ${POLLING_INTERVAL / 1000} sec`);
            pollingTimeout.current = setTimeout(() => {
                // eslint-disable-next-line no-use-before-define
                loadPendingExecutions();
            }, POLLING_INTERVAL);
        }
    }

    function loadPendingExecutions() {
        if (manager.maintenance !== Consts.MAINTENANCE_DEACTIVATED) {
            return;
        }

        fetchDataPromise.current = StageUtils.makeCancelable(onFetchActiveExecutions());
        fetchDataPromise.current.promise
            .then(() => {
                log.log('Maintenance data fetched');
                startPolling();
            })
            .catch((err: any) => {
                setErrors(err.message);
                startPolling();
            });
    }

    useEffect(() => {
        if (show) {
            unsetLoading();
            clearErrors();
            loadPendingExecutions();
        } else {
            stopPolling();
            stopFetchingData();
            onClose();
        }
        return stopPolling;
    }, [show]);

    function activate() {
        onMaintenanceActivate()
            .then(() => {
                clearErrors();
                unsetLoading();
                onHide();
            })
            .catch((err: any) => {
                setMessageAsError(err);
                unsetLoading();
            });
    }

    function deactivate() {
        onMaintenanceDeactivate()
            .then(() => {
                clearErrors();
                unsetLoading();
                onHide();
            })
            .catch((err: any) => {
                setMessageAsError(err);
                unsetLoading();
            });
    }

    function onApprove() {
        setLoading();

        if (manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            activate();
        } else {
            deactivate();
        }

        return false;
    }

    function onDeny() {
        onHide();
        return true;
    }

    function handleCancelExecution(execution: Execution, action: CancelAction) {
        onCancelExecution(execution, action)
            .then(() => {
                loadPendingExecutions();
                clearErrors();
            })
            .catch(setMessageAsError);
    }

    return (
        <Modal open={show} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="doctor" />
                {tConfirmModal(
                    manager.maintenance === Consts.MAINTENANCE_DEACTIVATED ? 'header.activate' : 'header.deactivate'
                )}
            </Modal.Header>

            {errors || !isEmpty(activeExecutions?.items) ? (
                <Modal.Content>
                    <ErrorMessage error={errors} />

                    {!isEmpty(activeExecutions?.items) && (
                        <>
                            <Message content={tConfirmModal('activeExecutionsDelay')} info />

                            <DataTable>
                                <DataTable.Column label={tExecutions('blueprint')} width="15%" />
                                <DataTable.Column label={tExecutions('deployment')} width="15%" />
                                <DataTable.Column label={tExecutions('workflow')} width="15%" />
                                <DataTable.Column label={tExecutions('id')} width="20%" />
                                <DataTable.Column label={tExecutions('system')} width="5%" />
                                <DataTable.Column label={tExecutions('status')} width="15%" />
                                <DataTable.Column label={tExecutions('action')} />

                                {activeExecutions?.items.map(item => {
                                    return (
                                        <DataTable.Row key={item.id}>
                                            <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                            <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                            <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                            <DataTable.Data>{item.id}</DataTable.Data>
                                            <DataTable.Data>
                                                <Checkmark value={item.is_system_workflow} />
                                            </DataTable.Data>
                                            <DataTable.Data>
                                                <ExecutionStatus execution={item} />
                                            </DataTable.Data>
                                            <DataTable.Data className="center aligned">
                                                <PopupMenu className="menuAction">
                                                    <Menu pointing vertical>
                                                        <Menu.Item
                                                            content={tExecutions('cancel')}
                                                            icon="cancel"
                                                            name={ExecutionUtils.CANCEL_ACTION}
                                                            onClick={() =>
                                                                handleCancelExecution(
                                                                    item,
                                                                    ExecutionUtils.CANCEL_ACTION
                                                                )
                                                            }
                                                        />
                                                        <Menu.Item
                                                            content={tExecutions('forceCancel')}
                                                            icon={<Icon name="cancel" color="red" />}
                                                            name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                                            onClick={() =>
                                                                handleCancelExecution(
                                                                    item,
                                                                    ExecutionUtils.FORCE_CANCEL_ACTION
                                                                )
                                                            }
                                                        />
                                                        <Menu.Item
                                                            content={tExecutions('killCancel')}
                                                            icon={<Icon name="stop" color="red" />}
                                                            name={ExecutionUtils.KILL_CANCEL_ACTION}
                                                            onClick={() =>
                                                                handleCancelExecution(
                                                                    item,
                                                                    ExecutionUtils.KILL_CANCEL_ACTION
                                                                )
                                                            }
                                                        />
                                                    </Menu>
                                                </PopupMenu>
                                            </DataTable.Data>
                                        </DataTable.Row>
                                    );
                                })}
                            </DataTable>
                        </>
                    )}
                </Modal.Content>
            ) : (
                ''
            )}

            <Modal.Actions>
                <CancelButton onClick={onDeny} content={tConfirmModal('no')} disabled={loading} />
                <ApproveButton onClick={onApprove} content={tConfirmModal('yes')} icon="doctor" disabled={loading} />
            </Modal.Actions>
        </Modal>
    );
}
