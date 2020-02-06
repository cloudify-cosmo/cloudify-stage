/**
 * Created by kinneretzin on 27/10/2016.
 */
import Dropdown from './Dropdown';

const deploymentFilter = { deployment_id: 'deploymentId' };
const blueprintFilter = { blueprint_id: 'blueprintId' };
const blueprintDeploymentFilter = { ...deploymentFilter, ...blueprintFilter };

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.configuration, nextProps.configuration) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprints:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('deployments:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('nodes:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('executions:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('events:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('topology:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('deployments:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('nodes:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('executions:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('events:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('topology:refresh', this._refreshData);
    }

    setValue(name, value) {
        this.props.toolbox.getContext().setValue(name, value);
        this.setState({ [name]: value });
    }

    componentDidUpdate(prevProps) {
        const oldAllowMultipleSelection = prevProps.configuration.allowMultipleSelection;
        const newAllowMultipleSelection = this.props.configuration.allowMultipleSelection;

        if (oldAllowMultipleSelection !== newAllowMultipleSelection) {
            this.setValue('blueprintId', null);
            this.setValue('deploymentId', null);
            this.setValue('nodeId', null);
            this.setValue('nodeInstanceId', null);
            this.setValue('executionId', null);
            this.setValue('depNodeId', null);
            this.setValue('executionStatus', null);
            this.setValue('siteName', null);
        }
    }

    updateDeplomentNodeIdValue(selectedDeploymentId, selectedNodeId) {
        const { allowMultipleSelection } = this.props.configuration;
        const context = this.props.toolbox.getContext();

        if (!allowMultipleSelection) {
            if (!_.isEmpty(selectedDeploymentId) && !_.isEmpty(selectedNodeId)) {
                const oldDepNodeId = context.getValue('depNodeId');
                const newDepNodeId = selectedNodeId + selectedDeploymentId;
                if (oldDepNodeId !== newDepNodeId) {
                    context.setValue('depNodeId', newDepNodeId);
                }
            } else {
                context.setValue('depNodeId', null);
            }
        }
    }

    updateTopologyWidget(selectedNodeId) {
        const { allowMultipleSelection } = this.props.configuration;

        if (!allowMultipleSelection) {
            this.props.toolbox.getEventBus().trigger('topology:selectNode', selectedNodeId);
        }
    }

    selectBlueprint(blueprintIds) {
        this.setValue('blueprintId', blueprintIds);
        this.setValue('deploymentId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    }

    selectDeployment(deploymentIds) {
        this.setValue('deploymentId', deploymentIds);
        this.setValue('nodeInstanceId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    }

    selectNode(nodeIds) {
        this.setValue('nodeId', nodeIds);
        this.setValue('nodeInstanceId', null);
        this.updateDeplomentNodeIdValue(this.state.deploymentId, nodeIds);
        this.updateTopologyWidget(nodeIds);
    }

    selectNodeInstance(nodeInstanceIds) {
        this.setValue('nodeInstanceId', nodeInstanceIds);
    }

    selectExecution(executionIds) {
        this.setValue('executionId', executionIds);
    }

    selectExecutionStatus(executionStatuses) {
        this.setValue('executionStatus', executionStatuses);
    }

    selectSiteName(siteNames) {
        this.setValue('siteName', siteNames);
    }

    render() {
        const { ErrorMessage, Form } = Stage.Basic;
        const { configuration } = this.props;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Form size="small">
                    <Form.Group inline widths="equal">
                        <Dropdown
                            value={this.state.blueprintId}
                            configuration={configuration}
                            entityName="Blueprint"
                            fetchUrl="/blueprints?_include=id"
                            onChange={this.selectBlueprint.bind(this)}
                            toolbox={this.props.toolbox}
                        />
                        <Dropdown
                            value={this.state.deploymentId}
                            configuration={configuration}
                            entityName="Deployment"
                            fetchUrl="/deployments?_include=id,blueprint_id"
                            onChange={this.selectDeployment.bind(this)}
                            toolbox={this.props.toolbox}
                            filter={blueprintFilter}
                            pageSize={20}
                        />
                        <Dropdown
                            value={this.state.nodeId}
                            configuration={configuration}
                            entityName="Node"
                            fetchUrl="/nodes?_include=id,blueprint_id,deployment_id"
                            onChange={this.selectNode.bind(this)}
                            toolbox={this.props.toolbox}
                            filter={blueprintDeploymentFilter}
                            pageSize={40}
                        />
                        <Dropdown
                            value={this.state.nodeInstanceId}
                            configuration={configuration}
                            entityName="Node Instance"
                            fetchUrl="/node-instances?_include=id,deployment_id,node_id"
                            onChange={this.selectNodeInstance.bind(this)}
                            toolbox={this.props.toolbox}
                            filter={{ ...deploymentFilter, node_id: 'nodeId' }}
                            pageSize={40}
                        />
                        <Dropdown
                            value={this.state.executionId}
                            configuration={configuration}
                            entityName="Execution"
                            fetchUrl="/executions?_include=id,blueprint_id,deployment_id,workflow_id"
                            textFormatter={item => `${item.id} (${item.workflow_id})`}
                            onChange={this.selectExecution.bind(this)}
                            toolbox={this.props.toolbox}
                            filter={blueprintDeploymentFilter}
                            pageSize={20}
                        />
                        <Dropdown
                            value={this.state.executionStatus}
                            configuration={configuration}
                            entityName="Execution Status"
                            enabledConfigurationKey="ExecutionsStatus"
                            fetchUrl="/executions?_include=id,blueprint_id,deployment_id,status_display"
                            fetchAll
                            valueProp="status_display"
                            onChange={this.selectExecutionStatus.bind(this)}
                            toolbox={this.props.toolbox}
                            filter={{
                                ...blueprintDeploymentFilter,
                                id: 'executionId'
                            }}
                        />
                        <Dropdown
                            value={this.state.siteName}
                            configuration={configuration}
                            entityName="Site Name"
                            enabledConfigurationKey="SiteName"
                            fetchUrl="/sites?_include=name"
                            valueProp="name"
                            onChange={this.selectSiteName.bind(this)}
                            toolbox={this.props.toolbox}
                        />
                    </Form.Group>
                </Form>
            </div>
        );
    }
}
