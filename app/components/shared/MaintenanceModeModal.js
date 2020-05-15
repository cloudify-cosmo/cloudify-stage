/**
 * Created by pposel on 16/02/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, Modal } from 'semantic-ui-react';
import {
    ApproveButton,
    CancelButton,
    Checkmark,
    DataTable,
    ErrorMessage,
    Menu,
    PopupMenu
} from 'cloudify-ui-components';

import ExecutionUtils from '../../utils/shared/ExecutionUtils';
import { switchMaintenance, getActiveExecutions, setActiveExecutions, doCancelExecution } from '../../actions/managers';
import ExecutionStatus from './ExecutionStatus';
import Consts from '../../utils/consts';
import StageUtils from '../../utils/stageUtils';

const POLLING_INTERVAL = 2000;

class MaintenanceModeModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = MaintenanceModeModal.initialState;
        this.pollingTimeout = null;
    }

    static initialState = {
        cancelling: [],
        loading: false,
        error: ''
    };

    static propTypes = {
        show: PropTypes.bool.isRequired,
        manager: PropTypes.object.isRequired,
        activeExecutions: PropTypes.object,
        onHide: PropTypes.func.isRequired,
        onMaintenanceActivate: PropTypes.func.isRequired,
        onMaintenanceDeactivate: PropTypes.func.isRequired,
        onFetchActiveExecutions: PropTypes.func.isRequired
    };

    static defaultProps = {
        activeExecutions: {}
    };

    componentDidUpdate(prevProps) {
        const { onClose, show } = this.props;
        if (!prevProps.show && show) {
            this.setState(MaintenanceModeModal.initialState);

            this.loadPendingExecutions();
        } else if (prevProps.show && !show) {
            this.stopPolling();
            this.stopFetchingData();
            onClose();
        }
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    loadPendingExecutions() {
        const { manager, onFetchActiveExecutions } = this.props;
        if (manager.maintenance !== Consts.MAINTENANCE_DEACTIVATED) {
            return;
        }

        this.fetchDataPromise = StageUtils.makeCancelable(onFetchActiveExecutions());
        this.fetchDataPromise.promise
            .then(data => {
                console.log('Maintenance data fetched');
                this.startPolling();
            })
            .catch(err => {
                this.setState({ error: err.message });
                this.startPolling();
            });
    }

    stopPolling() {
        console.log('Stop polling maintenance data');
        clearTimeout(this.pollingTimeout);
    }

    stopFetchingData() {
        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
    }

    startPolling() {
        this.stopPolling();
        this.stopFetchingData();

        if (this.props.show) {
            console.log(`Polling maintenance data - time interval: ${POLLING_INTERVAL / 1000} sec`);
            this.pollingTimeout = setTimeout(() => {
                this.loadPendingExecutions();
            }, POLLING_INTERVAL);
        }
    }

    onApprove() {
        this.setState({ loading: true });

        if (this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            this.activate();
        } else {
            this.deactivate();
        }

        return false;
    }

    onDeny() {
        this.props.onHide();
        return true;
    }

    activate() {
        const { onHide, onMaintenanceActivate } = this.props;
        onMaintenanceActivate()
            .then(() => {
                this.setState({ error: '', loading: false });
                onHide();
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false });
            });
    }

    deactivate() {
        const { onHide, onMaintenanceDeactivate } = this.props;
        onMaintenanceDeactivate()
            .then(() => {
                this.setState({ error: '', loading: false });
                onHide();
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false });
            });
    }

    cancelExecution(execution, action) {
        const { cancelling } = this.state;
        this.setState({ cancelling: [...cancelling, execution.id] }, () =>
            this.props
                .onCancelExecution(execution, action)
                .then(() => {
                    this.loadPendingExecutions();
                    this.setState({ error: '', cancelling: _.without(cancelling, execution.id) });
                })
                .catch(err => {
                    this.setState({ error: err.message });
                })
        );
    }

    render() {
        const { error, loading } = this.state;
        const { activeExecutions, manager, onHide, show } = this.props;
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
                                                                this.cancelExecution(item, ExecutionUtils.CANCEL_ACTION)
                                                            }
                                                        />
                                                        <Menu.Item
                                                            content="Force Cancel"
                                                            icon={<Icon name="cancel" color="red" />}
                                                            name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                                            onClick={() =>
                                                                this.cancelExecution(
                                                                    item,
                                                                    ExecutionUtils.FORCE_CANCEL_ACTION
                                                                )
                                                            }
                                                        />
                                                        <Menu.Item
                                                            content="Kill Cancel"
                                                            icon={<Icon name="stop" color="red" />}
                                                            name={ExecutionUtils.KILL_CANCEL_EXECUTION}
                                                            onClick={() =>
                                                                this.cancelExecution(
                                                                    item,
                                                                    ExecutionUtils.KILL_CANCEL_EXECUTION
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
                        )}
                    </Modal.Content>
                ) : (
                    ''
                )}

                <Modal.Actions>
                    <CancelButton onClick={this.onDeny.bind(this)} content="No" disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        content="Yes"
                        icon="doctor"
                        color="green"
                        disabled={loading}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager,
        show: ownProps.show,
        onHide: ownProps.onHide,
        activeExecutions: state.manager.activeExecutions
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
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
