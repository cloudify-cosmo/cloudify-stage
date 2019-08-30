/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ConsoleIcon from './ConsoleIcon';
import ExecuteWorkflowButton from './ExecuteWorkflowButton';
import ExecuteWorkflowIcon from './ExecuteWorkflowIcon';
import RefreshButton from './RefreshButton';
import RefreshIcon from './RefreshIcon';
import StatusIcon from './StatusIcon';

export default class ManagersTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            bulkOperation: false,
            deployment: {id: ''},
            error: null,
            selectedManagerId: null,
            selectedManagers: [],
            showDeploymentUpdateDetailsModal: false,
            showExecuteWorkflowModal: false,
            workflow: {name:'', parameters:[]}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('managers:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('managers:refresh', this.refreshData);
    }

    selectManager(manager) {
        let selectedManagerId = this.state.selectedManagerId;
        let clickedManagerId = manager.id;
        let clickedAlreadySelectedManager = clickedManagerId === selectedManagerId;
        this.setState({selectedManagerId: clickedAlreadySelectedManager ? null : manager.id});
    }

    openExecuteWorkflowModal(id, bulk, workflow) {
        this.setState({deployment: {id}, workflow: workflow, showExecuteWorkflowModal: true, bulkOperation: bulk});
    }

    hideExecuteWorkflowModal() {
        this.setState({deployment: {id: ''}, workflow: {name: '', parameters: []}, showExecuteWorkflowModal: false});
        this.refreshData();
    }

    openDeploymentUpdateDetailsModal(deploymentUpdateId) {
        this.setState({deploymentUpdateId, showDeploymentUpdateDetailsModal: true});
    }

    hideDeploymentUpdateDetailsModal() {
        this.setState({deploymentUpdateId: null, showDeploymentUpdateDetailsModal: false});
    }

    actOnExecution(execution, action) {
        let actions = new Stage.Common.ExecutionActions(this.props.toolbox);
        actions.doAct(execution, action).then(() => {
            this.setState({error: null});
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err) => {
            this.setState({error: err.message});
        });
    }

    showLogs(managerId, executionId) {
        this.props.toolbox.drillDown(this.props.widget, 'logs', {deploymentId: managerId, executionId}, `Execution Logs - ${executionId}`);
    }

    showError(errorMessage) {
        this.setState({error: `Last action has failed with error: ${errorMessage}`});
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Managers available.';
        const configuration = this.props.widget.configuration;
        const fieldsToShow = configuration.fieldsToShow;
        const totalSize = this.props.data.total > 0 ? undefined : 0;

        const allManagers = _.map(this.props.data.items, (manager) => manager.id);
        const selectedManagers = this.state.selectedManagers;
        const allManagersSelected = _.isEmpty(_.difference(allManagers, selectedManagers));
        const workflows = !_.isEmpty(selectedManagers)
            ? _.get(this.props.data, 'items[0].workflows', [])
            : [];

        let {Checkbox, DataTable, ErrorMessage} = Stage.Basic;
        let {ExecuteDeploymentModal, LastExecutionStatusIcon, UpdateDetailsModal} = Stage.Common;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true} />

                <DataTable selectable={false} noDataMessage={NO_DATA_MESSAGE} totalSize={totalSize}>

                    <DataTable.Column width="20px"
                                      label={<Checkbox checked={allManagersSelected}
                                                       indeterminate={!allManagersSelected && !_.isEmpty(selectedManagers)}
                                                       onChange={() =>
                                                           allManagersSelected
                                                               ? this.setState({selectedManagers: []})
                                                               : this.setState({selectedManagers: allManagers})
                                                       }
                                                       onClick={(e) => e.stopPropagation()} />}
                    />
                    <DataTable.Column label="Deployment"
                                      show={fieldsToShow.indexOf('Deployment') >= 0} />
                    <DataTable.Column label="IP"
                                      show={fieldsToShow.indexOf('IP') >= 0} />
                    <DataTable.Column label="Last Execution"
                                      show={fieldsToShow.indexOf('Last Execution') >= 0} />
                    <DataTable.Column label="Status" width="50px" centerAligned
                                      show={fieldsToShow.indexOf('Status') >= 0} />
                    <DataTable.Column label="Actions" width="150px" centerAligned
                                      show={fieldsToShow.indexOf('Actions') >= 0} />

                    {
                        _.map(this.props.data.items, (manager) => {
                            const inSelectedManagers = _.includes(selectedManagers, manager.id);

                            return (
                                <DataTable.Row key={manager.id} selected={manager.id === this.state.selectedManagerId}
                                               onClick={this.selectManager.bind(this, manager)}>
                                    <DataTable.Data>
                                        <Checkbox checked={inSelectedManagers}
                                                  onChange={() =>
                                                      inSelectedManagers
                                                          ? this.setState({selectedManagers: _.filter(selectedManagers, (id) => id !== manager.id)})
                                                          : this.setState({selectedManagers: [...selectedManagers, manager.id]})
                                                  }
                                                  onClick={(e) => e.stopPropagation()}
                                        />
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        {manager.id}
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        {manager.ip}
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <LastExecutionStatusIcon execution={manager.lastExecution}
                                                                 onShowLogs={() => this.showLogs(manager.id, manager.lastExecution.id)}
                                                                 onShowUpdateDetails={this.openDeploymentUpdateDetailsModal.bind(this)}
                                                                 onActOnExecution={this.actOnExecution.bind(this)}
                                                                 showLabel labelAttached={false} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <StatusIcon status={manager.status} error={manager.error} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <ConsoleIcon manager={manager} />
                                        <RefreshIcon manager={manager} toolbox={this.props.toolbox}
                                                     onSuccess={this.refreshData.bind(this)} onFail={this.showError.bind(this)} />
                                        <ExecuteWorkflowIcon workflows={manager.workflows}
                                                             onClick={this.openExecuteWorkflowModal.bind(this, manager.id, false)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                            )
                        })
                    }

                    <DataTable.Action>
                        <RefreshButton managers={selectedManagers}
                                       toolbox={this.props.toolbox}
                                       onSuccess={this.refreshData.bind(this)}
                                       onFail={this.showError.bind(this)} />
                        <ExecuteWorkflowButton managers={selectedManagers}
                                               workflows={workflows}
                                               onClick={this.openExecuteWorkflowModal.bind(this, selectedManagers[0], true)} />
                    </DataTable.Action>
                </DataTable>

                <ExecuteDeploymentModal toolbox={this.props.toolbox}
                                        open={this.state.showExecuteWorkflowModal}
                                        deployment={this.state.deployment}
                                        deployments={this.state.bulkOperation ? this.state.selectedManagers : []}
                                        workflow={this.state.workflow}
                                        onHide={this.hideExecuteWorkflowModal.bind(this)} />

                <UpdateDetailsModal open={this.state.showDeploymentUpdateDetailsModal}
                                    deploymentUpdateId={this.state.deploymentUpdateId}
                                    onClose={this.hideDeploymentUpdateDetailsModal.bind(this)}
                                    toolbox={this.props.toolbox} />
            </div>
        );
    }
}
