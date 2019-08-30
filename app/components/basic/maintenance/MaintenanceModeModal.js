/**
 * Created by pposel on 16/02/2017.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Consts from '../../../utils/consts';
import {
    ApproveButton,
    CancelButton,
    Checkmark,
    DataTable,
    ErrorMessage,
    ExecutionStatus,
    Icon,
    Menu,
    Modal,
    PopupMenu
} from '../index';
import StageUtils from '../../../utils/stageUtils';
import {
    switchMaintenance,
    getActiveExecutions,
    setActiveExecutions,
    doCancelExecution
} from '../../../actions/managers';
import ExecutionUtils from '../../../utils/shared/ExecutionUtils';

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
        if (!prevProps.show && this.props.show) {
            this.setState(MaintenanceModeModal.initialState);

            this._loadPendingExecutions();
        } else if (prevProps.show && !this.props.show) {
            this._stopPolling();
            this._stopFetchingData();
            this.props.onClose();
        }
    }

    componentWillUnmount() {
        this._stopPolling();
    }

    _loadPendingExecutions() {
        if (this.props.manager.maintenance !== Consts.MAINTENANCE_DEACTIVATED) {
            return;
        }

        this.fetchDataPromise = StageUtils.makeCancelable(this.props.onFetchActiveExecutions());
        this.fetchDataPromise.promise
            .then(data => {
                console.log('Maintenance data fetched');
                this._startPolling();
            })
            .catch(err => {
                this.setState({ error: err.message });
                this._startPolling();
            });
    }

    _stopPolling() {
        console.log('Stop polling maintenance data');
        clearTimeout(this.pollingTimeout);
    }

    _stopFetchingData() {
        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
    }

    _startPolling() {
        this._stopPolling();
        this._stopFetchingData();

        if (this.props.show) {
            console.log(`Polling maintenance data - time interval: ${POLLING_INTERVAL / 1000} sec`);
            this.pollingTimeout = setTimeout(() => {
                this._loadPendingExecutions();
            }, POLLING_INTERVAL);
        }
    }

    onApprove() {
        this.setState({ loading: true });

        if (this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            this._activate();
        } else {
            this._deactivate();
        }

        return false;
    }

    onDeny() {
        this.props.onHide();
        return true;
    }

    _activate() {
        this.props
            .onMaintenanceActivate()
            .then(() => {
                this.setState({ error: '', loading: false });
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false });
            });
    }

    _deactivate() {
        this.props
            .onMaintenanceDeactivate()
            .then(() => {
                this.setState({ error: '', loading: false });
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false });
            });
    }

    _cancelExecution(execution, action) {
        this.setState({ cancelling: [...this.state.cancelling, execution.id] }, () =>
            this.props
                .onCancelExecution(execution, action)
                .then(() => {
                    this._loadPendingExecutions();
                    this.setState({ error: '', cancelling: _.without(this.state.cancelling, execution.id) });
                })
                .catch(err => {
                    this.setState({ error: err.message });
                })
        );
    }

    render() {
        return (
            <Modal open={this.props.show} onClose={() => this.props.onHide()}>
                <Modal.Header>
                    <Icon name="doctor" />
                    {this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED
                        ? 'Are you sure you want to enter maintenance mode?'
                        : 'Are you sure you want to exit maintenance mode?'}
                </Modal.Header>

                {this.state.error || !_.isEmpty(this.props.activeExecutions.items) ? (
                    <Modal.Content>
                        <ErrorMessage error={this.state.error} />

                        {!_.isEmpty(this.props.activeExecutions.items) && (
                            <DataTable>
                                <DataTable.Column label="Blueprint" width="15%" />
                                <DataTable.Column label="Deployment" width="15%" />
                                <DataTable.Column label="Workflow" width="15%" />
                                <DataTable.Column label="Id" width="20%" />
                                <DataTable.Column label="System" width="5%" />
                                <DataTable.Column label="Status" width="15%" />
                                <DataTable.Column label="Action" />

                                {this.props.activeExecutions.items.map(item => {
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
                                                                this._cancelExecution(
                                                                    item,
                                                                    ExecutionUtils.CANCEL_ACTION
                                                                )
                                                            }
                                                        />
                                                        <Menu.Item
                                                            content="Force Cancel"
                                                            icon={<Icon name="cancel" color="red" />}
                                                            name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                                            onClick={() =>
                                                                this._cancelExecution(
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
                                                                this._cancelExecution(
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
                    <CancelButton onClick={this.onDeny.bind(this)} content="No" disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        content="Yes"
                        icon="doctor"
                        color="green"
                        disabled={this.state.loading}
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
