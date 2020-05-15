/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ConsoleIcon from './ConsoleIcon';
import ExecuteWorkflowButton from './ExecuteWorkflowButton';
import ExecuteWorkflowIcon from './ExecuteWorkflowIcon';
import RefreshButton from './RefreshButton';
import RefreshIcon from './RefreshIcon';
import StatusIcon from './StatusIcon';
import Actions from './actions';

export default class ManagersTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            bulkOperation: false,
            deployment: { id: '' },
            error: null,
            selectedManagerId: null,
            selectedManagers: [],
            showDeploymentUpdateDetailsModal: false,
            showExecuteWorkflowModal: false,
            workflow: { name: '', parameters: [] },
            status: _(props.data.items)
                .mapKeys(manager => manager.id)
                .mapValues(() => ({ isFetching: false, status: {} }))
                .value()
        };

        this.actions = new Actions(this.props.toolbox);
        this.handleStatusFetching = this.handleStatusFetching.bind(this);
        this.handleStatusBulkFetching = this.handleStatusBulkFetching.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
        this.handleStatusError = this.handleStatusError.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        const { data, toolbox } = this.props;
        toolbox.getEventBus().on('managers:refresh', this.refreshData, this);

        const managerIds = _.map(data.items, 'id');
        this.handleStatusBulkFetching(managerIds);
        _.forEach(managerIds, managerId =>
            this.actions.getClusterStatus(managerId, _.noop, this.handleStatusUpdate, this.handleStatusError)
        );
    }

    componentDidUpdate(prevProps) {
        const newManagers = _.get(this.props, 'data.items', []);
        const oldManagers = _.get(prevProps, 'data.items', []);

        if (!_.isEqual(oldManagers, newManagers)) {
            const managerIds = _.map(newManagers, 'id');

            const { status } = this.state;
            const currentStatus = _.pick(status, managerIds);
            const emptyStatusForAllManagers = _(newManagers)
                .mapKeys('id')
                .mapValues(() => ({ isFetching: false, status: {} }))
                .value();
            this.setState({ status: { ...emptyStatusForAllManagers, ...currentStatus } });
        }
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('managers:refresh', this.refreshData);
    }

    selectManager(manager) {
        const { selectedManagerId } = this.state;
        const clickedManagerId = manager.id;
        const clickedAlreadySelectedManager = clickedManagerId === selectedManagerId;
        this.setState({ selectedManagerId: clickedAlreadySelectedManager ? null : manager.id });
    }

    openExecuteWorkflowModal(id, bulk, workflow) {
        this.setState({ deployment: { id }, workflow, showExecuteWorkflowModal: true, bulkOperation: bulk });
    }

    hideExecuteWorkflowModal() {
        this.setState({
            deployment: { id: '' },
            workflow: { name: '', parameters: [] },
            showExecuteWorkflowModal: false
        });
        this.refreshData();
    }

    openDeploymentUpdateDetailsModal(deploymentUpdateId) {
        this.setState({ deploymentUpdateId, showDeploymentUpdateDetailsModal: true });
    }

    hideDeploymentUpdateDetailsModal() {
        this.setState({ deploymentUpdateId: null, showDeploymentUpdateDetailsModal: false });
    }

    actOnExecution(execution, action) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.ExecutionActions(toolbox);
        actions
            .doAct(execution, action)
            .then(() => {
                this.setState({ error: null });
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    showLogs(managerId, executionId) {
        const { toolbox, widget } = this.props;
        toolbox.drillDown(widget, 'logs', { deploymentId: managerId, executionId }, `Execution Logs - ${executionId}`);
    }

    handleStatusFetching(managerId) {
        this.setState({ status: { ...this.state.status, [managerId]: { isFetching: true, status: {} } } });
    }

    handleStatusBulkFetching(managerIds) {
        const newStatus = {};
        _.forEach(managerIds, managerId => {
            newStatus[managerId] = { isFetching: true, status: {} };
        });
        this.setState({ status: { ...this.state.status, ...newStatus } });
    }

    handleStatusUpdate(managerId, status) {
        this.setState({ status: { ...this.state.status, [managerId]: { isFetching: false, status } } });
    }

    handleStatusError(managerId, errorMessage) {
        this.setState({ status: { ...this.state.status, [managerId]: { isFetching: false, status: {} } } });
        this.setState({ error: `Status update for ${managerId} has failed.` });
    }

    render() {
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Managers available.';
        const { configuration } = widget;
        const { fieldsToShow } = configuration;
        const totalSize = data.total > 0 ? undefined : 0;

        const allManagers = _.map(data.items, manager => manager.id);
        const {
            selectedManagers,
            bulkOperation,
            deployment,
            deploymentUpdateId,
            error,
            selectedManagerId,
            showDeploymentUpdateDetailsModal,
            showExecuteWorkflowModal,
            workflow
        } = this.state;
        const allManagersSelected = _.isEmpty(_.difference(allManagers, selectedManagers));
        const workflows = !_.isEmpty(selectedManagers) ? _.get(data, 'items[0].workflows', []) : [];

        const { Checkbox, DataTable, ErrorMessage } = Stage.Basic;
        const { ExecuteDeploymentModal, LastExecutionStatusIcon, UpdateDetailsModal } = Stage.Common;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable selectable={false} noDataMessage={NO_DATA_MESSAGE} totalSize={totalSize}>
                    <DataTable.Column
                        width="20px"
                        label={
                            <Checkbox
                                checked={allManagersSelected}
                                indeterminate={!allManagersSelected && !_.isEmpty(selectedManagers)}
                                onChange={() =>
                                    allManagersSelected
                                        ? this.setState({ selectedManagers: [] })
                                        : this.setState({ selectedManagers: allManagers })
                                }
                                onClick={e => e.stopPropagation()}
                            />
                        }
                    />
                    <DataTable.Column label="Deployment" show={fieldsToShow.indexOf('Deployment') >= 0} />
                    <DataTable.Column label="IP" show={fieldsToShow.indexOf('IP') >= 0} />
                    <DataTable.Column label="Last Execution" show={fieldsToShow.indexOf('Last Execution') >= 0} />
                    <DataTable.Column
                        label="Status"
                        width="50px"
                        centerAligned
                        show={fieldsToShow.indexOf('Status') >= 0}
                    />
                    <DataTable.Column
                        label="Actions"
                        width="150px"
                        centerAligned
                        show={fieldsToShow.indexOf('Actions') >= 0}
                    />

                    {_.map(data.items, manager => {
                        const inSelectedManagers = _.includes(selectedManagers, manager.id);
                        const { isFetching, status } = _.get(status, manager.id, {
                            isFetching: false,
                            status: {}
                        });

                        return (
                            <DataTable.Row
                                key={manager.id}
                                selected={manager.id === selectedManagerId}
                                onClick={this.selectManager.bind(this, manager)}
                            >
                                <DataTable.Data>
                                    <Checkbox
                                        checked={inSelectedManagers}
                                        onChange={() =>
                                            inSelectedManagers
                                                ? this.setState({
                                                      selectedManagers: _.filter(
                                                          selectedManagers,
                                                          id => id !== manager.id
                                                      )
                                                  })
                                                : this.setState({
                                                      selectedManagers: [...selectedManagers, manager.id]
                                                  })
                                        }
                                        onClick={e => e.stopPropagation()}
                                    />
                                </DataTable.Data>
                                <DataTable.Data>{manager.id}</DataTable.Data>
                                <DataTable.Data>{manager.ip}</DataTable.Data>
                                <DataTable.Data>
                                    <LastExecutionStatusIcon
                                        execution={manager.lastExecution}
                                        onShowLogs={() => this.showLogs(manager.id, manager.lastExecution.id)}
                                        onShowUpdateDetails={this.openDeploymentUpdateDetailsModal.bind(this)}
                                        onActOnExecution={this.actOnExecution.bind(this)}
                                        showLabel
                                        labelAttached={false}
                                    />
                                </DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <StatusIcon status={status} isFetching={isFetching} />
                                </DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <ConsoleIcon manager={manager} />
                                    <RefreshIcon
                                        manager={manager}
                                        toolbox={toolbox}
                                        onStart={this.handleStatusFetching}
                                        onSuccess={this.handleStatusUpdate}
                                        onFail={this.handleStatusError}
                                    />
                                    <ExecuteWorkflowIcon
                                        workflows={manager.workflows}
                                        onClick={this.openExecuteWorkflowModal.bind(this, manager.id, false)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <RefreshButton
                            managers={selectedManagers}
                            toolbox={toolbox}
                            onStart={this.handleStatusBulkFetching}
                            onSuccess={this.handleStatusUpdate}
                            onFail={this.handleStatusError}
                        />
                        <ExecuteWorkflowButton
                            managers={selectedManagers}
                            workflows={workflows}
                            onClick={this.openExecuteWorkflowModal.bind(this, selectedManagers[0], true)}
                        />
                    </DataTable.Action>
                </DataTable>

                <ExecuteDeploymentModal
                    toolbox={toolbox}
                    open={showExecuteWorkflowModal}
                    deployment={deployment}
                    deployments={bulkOperation ? selectedManagers : []}
                    workflow={workflow}
                    onHide={this.hideExecuteWorkflowModal.bind(this)}
                />

                <UpdateDetailsModal
                    open={showDeploymentUpdateDetailsModal}
                    deploymentUpdateId={deploymentUpdateId}
                    onClose={this.hideDeploymentUpdateDetailsModal.bind(this)}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}
