// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
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
import ExecutionStatus from './ExecutionStatus';
import type { ReduxState } from '../../reducers';
import type { ActiveExecutions } from '../../actions/manager/maintenance';

const POLLING_INTERVAL = 2000;

const tConfirmModal = StageUtils.getT('maintenanceMode.confirmModal');
const tExecutions = StageUtils.composeT(tConfirmModal, 'executions');

interface MaintenanceModeModalProps {
    show: boolean;
    onHide: () => void;
}

export default function MaintenanceModeModal({ onHide, show }: MaintenanceModeModalProps) {
    const dispatch = useDispatch();
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

    const pollingTimeout = useRef(null);
    const fetchDataPromise = useRef();

    function stopFetchingData() {
        if (fetchDataPromise.current) {
            fetchDataPromise.current.cancel();
        }
    }

    function stopPolling() {
        log.log('Stop polling maintenance data');
        clearTimeout(pollingTimeout.current);
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

            {errors || !_.isEmpty(activeExecutions?.items) ? (
                <Modal.Content>
                    <ErrorMessage error={errors} />

                    {!_.isEmpty(activeExecutions?.items) && (
                        <>
                            <Message content={tConfirmModal('activeExecutionsDelay')} info />

                            <DataTable>
                                <DataTable.Column label={tExecutions('blueprint', 'Blueprint')} width="15%" />
                                <DataTable.Column label={tExecutions('deployment', 'Deployment')} width="15%" />
                                <DataTable.Column label={tExecutions('workflow', 'Workflow')} width="15%" />
                                <DataTable.Column label={tExecutions('id', 'Id')} width="20%" />
                                <DataTable.Column label={tExecutions('system', 'System')} width="5%" />
                                <DataTable.Column label={tExecutions('status', 'Status')} width="15%" />
                                <DataTable.Column label={tExecutions('action', 'Action')} />

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
                                                            content={tExecutions('cancel', 'Cancel')}
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
                                                            content={tExecutions('forceCancel', 'Force Cancel')}
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
                                                            content={tExecutions('killCancel', 'Kill Cancel')}
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
                <CancelButton onClick={onDeny} content={tConfirmModal('no', 'No')} disabled={loading} />
                <ApproveButton
                    onClick={onApprove}
                    content={tConfirmModal('yes', 'Yes')}
                    icon="doctor"
                    disabled={loading}
                />
            </Modal.Actions>
        </Modal>
    );
}
