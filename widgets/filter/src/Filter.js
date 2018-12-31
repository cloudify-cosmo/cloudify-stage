/**
 * Created by kinneretzin on 27/10/2016.
 */

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.configuration, nextProps.configuration)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
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

    componentDidUpdate(prevProps) {
        const oldAllowMultipleSelection = prevProps.configuration.allowMultipleSelection;
        const newAllowMultipleSelection = this.props.configuration.allowMultipleSelection;

        if (oldAllowMultipleSelection !== newAllowMultipleSelection) {
            this.props.toolbox.getContext().setValue('blueprintId', null);
            this.props.toolbox.getContext().setValue('deploymentId', null);
            this.props.toolbox.getContext().setValue('nodeId', null);
            this.props.toolbox.getContext().setValue('nodeInstanceId', null);
            this.props.toolbox.getContext().setValue('executionId', null);
            this.props.toolbox.getContext().setValue('depNodeId', null);
        }
    }

    _updateResourceValue(valueName, resourcesName, changedIdNameInResource, changedIds) {
        const data = this.props.data;
        const context = this.props.toolbox.getContext();
        const allowMultipleSelection = this.props.configuration.allowMultipleSelection;
        let value = context.getValue(valueName);

        if (!_.isEmpty(data[valueName]) && !_.isEmpty(changedIds)) {
            const selectedResources = _.filter(data[resourcesName].items,
                (resource) => _.includes(data[valueName], resource.id));
            let selectedResourceId = _.castArray(data[valueName]);

            _.forEach(selectedResources, (resource) => {
                if (!_.includes(changedIds, resource[changedIdNameInResource])) {
                    if (allowMultipleSelection) {
                        _.pull(selectedResourceId, resource.id);
                    } else {
                        selectedResourceId = null
                    }
                }
            });

            value = _.isEmpty(selectedResourceId)
                ? null
                : (allowMultipleSelection ? selectedResourceId : selectedResourceId[0]);
            context.setValue(valueName, value);
        }

        return value;
    }

    _updateDeplomentNodeIdValue(selectedDeploymentId, selectedNodeId) {
        const allowMultipleSelection = this.props.configuration.allowMultipleSelection;
        const context = this.props.toolbox.getContext();

        if (!allowMultipleSelection) {
            if (!_.isEmpty(selectedDeploymentId) && !_.isEmpty(selectedNodeId)) {
                let oldDepNodeId = context.getValue('depNodeId');
                let newDepNodeId = selectedNodeId + selectedDeploymentId;
                if (oldDepNodeId !== newDepNodeId) {
                    context.setValue('depNodeId', newDepNodeId);
                }
            } else {
                context.setValue('depNodeId', null);
            }
        }
    }
    
    _updateTopologyWidget(selectedNodeId) {
        const allowMultipleSelection = this.props.configuration.allowMultipleSelection;
        
        if (!allowMultipleSelection) {
            this.props.toolbox.getEventBus().trigger('topology:selectNode', selectedNodeId);
        }
    }

    _selectBlueprint(proxy, field){
        let blueprintIds = !_.isEmpty(field.value) ? field.value : null;

        if (!_.isEmpty(blueprintIds)) {
            let selectedBlueprintIds =  _.castArray(blueprintIds);
            let deploymentIds = this._updateResourceValue('deploymentId', 'deployments', 'blueprint_id', selectedBlueprintIds);
            let nodeIds = this._updateResourceValue('nodeId', 'nodes', 'blueprint_id', selectedBlueprintIds);
            this._updateResourceValue('nodeInstanceId', 'nodeInstances', 'deployment_id', deploymentIds);
            this._updateResourceValue('nodeInstanceId', 'nodeInstances', 'node_id', nodeIds);
            this._updateResourceValue('executionId', 'executions', 'blueprint_id', selectedBlueprintIds);

            this._updateDeplomentNodeIdValue(deploymentIds, nodeIds);
        }

        this.props.toolbox.getContext().setValue('blueprintId',blueprintIds);
    }

    _selectDeployment(proxy, field) {
        let deploymentIds = !_.isEmpty(field.value) ? field.value : null;

        if (!_.isEmpty(deploymentIds)) {
            let selectedDeploymentIds =  _.castArray(deploymentIds);

            let nodeIds = this._updateResourceValue('nodeId', 'nodes', 'deployment_id', selectedDeploymentIds);
            this._updateResourceValue('nodeInstanceId', 'nodeInstances', 'deployment_id', selectedDeploymentIds);
            this._updateResourceValue('executionId', 'executions', 'deployment_id', selectedDeploymentIds);

            this._updateDeplomentNodeIdValue(deploymentIds, nodeIds);
        }

        this.props.toolbox.getContext().setValue('deploymentId', deploymentIds);
    }

    _selectNode(proxy, field) {
        let nodeIds = !_.isEmpty(field.value) ? field.value : null;

        if (!_.isEmpty(nodeIds)) {
            let selectedNodeIds = _.castArray(nodeIds);

            this._updateResourceValue('nodeInstanceId', 'nodeInstances', 'node_id', selectedNodeIds);

            this._updateDeplomentNodeIdValue(this.props.data.deploymentId, nodeIds);
        }

        this.props.toolbox.getContext().setValue('nodeId', nodeIds);
        this._updateTopologyWidget(nodeIds);
    }

    _selectNodeInstance(proxy, field) {
        let nodeInstanceIds = !_.isEmpty(field.value) ? field.value : null;

        this.props.toolbox.getContext().setValue('nodeInstanceId', nodeInstanceIds);
    }

    _selectExecution(proxy, field) {
        let executionIds = !_.isEmpty(field.value) ? field.value : null;

        this.props.toolbox.getContext().setValue('executionId', executionIds);
    }

    _selectExecutionStatus(proxy, field) {
        let executionStatuses = !_.isEmpty(field.value) ? field.value : null;
        this.props.toolbox.getContext().setValue('executionStatus', executionStatuses);
    }

    _getDropdownValue(value) {
        const allowMultipleSelection = this.props.configuration.allowMultipleSelection;

        if (_.isString(value)) {
            return allowMultipleSelection ? [value]: value;
        } else if (_.isArray(value)) {
            return allowMultipleSelection ? value: value[0];
        } else {
            return allowMultipleSelection ? [] : '';
        }
    }

    render() {
        let {ErrorMessage, Form} = Stage.Basic;
        const EMPTY_OPTION = {text:'', value:''};
        const configuration = this.props.configuration;
        const data = this.props.data;

        let blueprintOptions = [];
        if (configuration.filterByBlueprints) {
            blueprintOptions = _.map(data.blueprints.items,
                blueprint => ({text: blueprint.id, value: blueprint.id}));
            if (!configuration.allowMultipleSelection) {
                blueprintOptions.unshift(EMPTY_OPTION);
            }
        }
        let blueprintId = this._getDropdownValue(data.blueprintId);

        let deploymentOptions = [];
        if (configuration.filterByDeployments) {
            deploymentOptions = _.map(data.deployments.items,
                deployment => ({text: deployment.id, value: deployment.id}));
            if (!configuration.allowMultipleSelection) {
                deploymentOptions.unshift(EMPTY_OPTION);
            }
        }
        let deploymentId = this._getDropdownValue(data.deploymentId);

        let nodeOptions = [];
        if (configuration.filterByNodes) {
            nodeOptions = _.map(_.sortedUniqBy(data.nodes.items, 'id'),
                node => ({text: node.id, value: node.id}));
            if (!configuration.allowMultipleSelection) {
                nodeOptions.unshift(EMPTY_OPTION);
            }
        }
        let nodeId = this._getDropdownValue(data.nodeId);

        let nodeInstanceOptions = [];
        if (configuration.filterByNodeInstances) {
            nodeInstanceOptions = _.map(data.nodeInstances.items,
                nodeInstance => ({text: nodeInstance.id, value: nodeInstance.id}));
            if (!configuration.allowMultipleSelection) {
                nodeInstanceOptions.unshift(EMPTY_OPTION);
            }
        }
        let nodeInstanceId = this._getDropdownValue(data.nodeInstanceId);

        let executionOptions = [];
        if (configuration.filterByExecutions) {
            executionOptions = _.map(data.executions.items,
                execution => ({text: `${execution.id} (${execution.workflow_id})`, value: execution.id}));
            if (!configuration.allowMultipleSelection) {
                executionOptions.unshift(EMPTY_OPTION);
            }
        }
        let executionId = this._getDropdownValue(data.executionId);

        let executionStatusOptions = [];
        if (configuration.filterByExecutionsStatus) {
            executionStatusOptions = _.map(_.sortedUniqBy(data.executionsStatuses.items, 'status_display'),
                execution => ({text: execution.status_display, value: execution.status_display}));
            if (!configuration.allowMultipleSelection) {
                executionStatusOptions.unshift(EMPTY_OPTION);
            }
        }
        let executionStatus = this._getDropdownValue(data.executionStatus);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <Form size="small">
                    <Form.Group inline widths='equal'>
                        {
                            configuration.filterByBlueprints &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Blueprint" fluid
                                               value={blueprintId} id="blueprintFilterField"
                                               options={blueprintOptions} onChange={this._selectBlueprint.bind(this)}
                                               multiple={configuration.allowMultipleSelection}/>
                            </Form.Field>
                        }
                        {
                            configuration.filterByDeployments &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Deployment" fluid
                                               value={deploymentId} id="deploymentFilterField"
                                               options={deploymentOptions} onChange={this._selectDeployment.bind(this)}
                                               multiple={configuration.allowMultipleSelection}/>
                            </Form.Field>
                        }
                        {
                            configuration.filterByNodes &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Node" fluid
                                               value={nodeId} id="nodeFilterField"
                                               options={nodeOptions} onChange={this._selectNode.bind(this)}
                                               multiple={configuration.allowMultipleSelection} />
                            </Form.Field>
                        }
                        {
                            configuration.filterByNodeInstances &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Node Instance" fluid
                                               value={nodeInstanceId} id="nodeInstanceFilterField"
                                               options={nodeInstanceOptions} onChange={this._selectNodeInstance.bind(this)}
                                               multiple={configuration.allowMultipleSelection} />
                            </Form.Field>
                        }
                        {
                            configuration.filterByExecutions &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Execution" fluid
                                               value={executionId} id="executionFilterField"
                                               options={executionOptions} onChange={this._selectExecution.bind(this)}
                                               multiple={configuration.allowMultipleSelection} />
                            </Form.Field>
                        }
                        {
                            configuration.filterByExecutionsStatus &&
                            <Form.Field>
                                <Form.Dropdown search selection placeholder="Execution Status" fluid
                                               value={executionStatus} id="executionStatusFilterField"
                                               options={executionStatusOptions} onChange={this._selectExecutionStatus.bind(this)}
                                               multiple={configuration.allowMultipleSelection} />
                            </Form.Field>
                        }
                    </Form.Group>
                </Form>
            </div>
        );
    }
}