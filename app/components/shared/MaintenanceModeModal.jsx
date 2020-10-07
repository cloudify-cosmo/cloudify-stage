/**
 * Created by pposel on 16/02/2017.
 */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';

import {
    ApproveButton,
    CancelButton,
    Checkmark,
    DataTable,
    ErrorMessage,
    Icon,
    Menu,
    Modal,
    PopupMenu
} from '../basic';
import { doCancelExecution, getActiveExecutions, setActiveExecutions, switchMaintenance } from '../../actions/managers';
import Consts from '../../utils/consts';

import ExecutionUtils from '../../utils/shared/ExecutionUtils';
import StageUtils from '../../utils/stageUtils';
import ExecutionStatus from './ExecutionStatus';

const POLLING_INTERVAL = 2000;

function MaintenanceModeModal({
    activeExecutions,
    manager,
    onCancelExecution,
    onClose,
    onFetchActiveExecutions,
    onHide,
    onMaintenanceActivate,
    onMaintenanceDeactivate,
    show
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            .catch(err => {
                setError(err.message);
                startPolling();
            });
    }

    useEffect(() => {
        if (show) {
            setLoading(false);
            setError('');
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
                setError('');
                setLoading(false);
                onHide();
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }

    function deactivate() {
        onMaintenanceDeactivate()
            .then(() => {
                setError('');
                setLoading(false);
                onHide();
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }

    function onApprove() {
        setLoading(true);

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

    function cancelExecution(execution, action) {
        onCancelExecution(execution, action)
            .then(() => {
                loadPendingExecutions();
                setError('');
            })
            .catch(err => {
                setError(err.message);
            });
    }

    return (
        <Modal open={show} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="doctor" />
                {manager.maintenance === Consts.MAINTENANCE_DEACTIVATED
                    ? 'Are you sure you want to enter maintenance mode?'
                    : 'Are you sure you want to exit maintenance mode?'}
            </Modal.Header>

            {error || !_.isEmpty(activeExecutions.items) ? (
                <Modal.Content>
                    <ErrorMessage error={error} />

                    {!_.isEmpty(activeExecutions.items) && (
                        <DataTable>
                            <DataTable.Column label="Blueprint" width="15%" />
                            <DataTable.Column label="Deployment" width="15%" />
                            <DataTable.Column label="Workflow" width="15%" />
                            <DataTable.Column label="Id" width="20%" />
                            <DataTable.Column label="System" width="5%" />
                            <DataTable.Column label="Status" width="15%" />
                            <DataTable.Column label="Action" />

                            {activeExecutions.items.map(item => {
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
                                                        content="Cancel"
                                                        icon="cancel"
                                                        name={ExecutionUtils.CANCEL_ACTION}
                                                        onClick={() =>
                                                            cancelExecution(item, ExecutionUtils.CANCEL_ACTION)
                                                        }
                                                    />
                                                    <Menu.Item
                                                        content="Force Cancel"
                                                        icon={<Icon name="cancel" color="red" />}
                                                        name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                                        onClick={() =>
                                                            cancelExecution(item, ExecutionUtils.FORCE_CANCEL_ACTION)
                                                        }
                                                    />
                                                    <Menu.Item
                                                        content="Kill Cancel"
                                                        icon={<Icon name="stop" color="red" />}
                                                        name={ExecutionUtils.KILL_CANCEL_EXECUTION}
                                                        onClick={() =>
                                                            cancelExecution(item, ExecutionUtils.KILL_CANCEL_EXECUTION)
                                                        }
                                                    />
                                                </Menu>
                                            </PopupMenu>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    )}
                </Modal.Content>
            ) : (
                ''
            )}

            <Modal.Actions>
                <CancelButton onClick={onDeny} content="No" disabled={loading} />
                <ApproveButton onClick={onApprove} content="Yes" icon="doctor" color="green" disabled={loading} />
            </Modal.Actions>
        </Modal>
    );
}

MaintenanceModeModal.propTypes = {
    show: PropTypes.bool.isRequired,
    manager: PropTypes.shape({ maintenance: PropTypes.string }).isRequired,
    onCancelExecution: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onMaintenanceActivate: PropTypes.func.isRequired,
    onMaintenanceDeactivate: PropTypes.func.isRequired,
    onFetchActiveExecutions: PropTypes.func.isRequired,
    activeExecutions: PropTypes.shape({
        items: PropTypes.shape({
            blueprint_id: PropTypes.string,
            deployment_id: PropTypes.string,
            id: PropTypes.string,
            is_system_workflow: PropTypes.string,
            map: PropTypes.func,
            workflow_id: PropTypes.string
        })
    })
};

MaintenanceModeModal.defaultProps = {
    activeExecutions: {}
};

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager,
        show: ownProps.show,
        onHide: ownProps.onHide,
        activeExecutions: state.manager.activeExecutions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onMaintenanceActivate: manager => {
            return dispatch(switchMaintenance(manager, true));
        },
        onMaintenanceDeactivate: manager => {
            return dispatch(switchMaintenance(manager, false));
        },
        onFetchActiveExecutions: manager => {
            return dispatch(getActiveExecutions(manager));
        },
        onCancelExecution: (manager, execution, action) => {
            return dispatch(doCancelExecution(manager, execution, action));
        },
        onClose: () => {
            return dispatch(setActiveExecutions({}));
        }
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        onMaintenanceActivate: () => dispatchProps.onMaintenanceActivate(stateProps.manager),
        onMaintenanceDeactivate: () => dispatchProps.onMaintenanceDeactivate(stateProps.manager),
        onFetchActiveExecutions: () => dispatchProps.onFetchActiveExecutions(stateProps.manager),
        onCancelExecution: (execution, action) => dispatchProps.onCancelExecution(stateProps.manager, execution, action)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(MaintenanceModeModal);
