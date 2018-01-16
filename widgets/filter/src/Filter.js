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
        return !_.isEqual(this.props.widget, nextProps.widget)
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
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('deployments:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('nodes:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('executions:refresh', this._refreshData);
    }

    _selectBlueprint(proxy, field){
        var blueprintId = field.value;
        if (_.isEmpty(blueprintId)) {
            blueprintId = null;
        }

        // Clear the selected deployment && execution if its not related to the selected blueprint
        if (!_.isEmpty(blueprintId)) {
            if (this.props.data.deploymentId) {
                var currDeployment = _.find(this.props.data.deployments.items,{id:this.props.data.deploymentId});
                if (currDeployment.blueprint_id !== blueprintId) {
                    this.props.toolbox.getContext().setValue('deploymentId',null);
                }
            }

            if (this.props.data.nodeId) {
                var currNode = _.find(this.props.data.nodes.items,{id:this.props.data.nodeId});
                if (currNode.blueprint_id !== blueprintId) {
                    this.props.toolbox.getContext().setValue('nodeId',null);
                    this.props.toolbox.getContext().setValue('nodeInstanceId',null);
                }
            }

            if (this.props.data.executionId) {
                var currExecution = _.find(this.props.data.executions.items,{id:this.props.data.executionId});
                if (currExecution.blueprint_id !== blueprintId) {
                    this.props.toolbox.getContext().setValue('executionId',null);
                }
            }
        }

        this.props.toolbox.getContext().setValue('blueprintId',blueprintId);
    }

    _selectDeployment(proxy, field) {
        var deploymentId = field.value;
        if (_.isEmpty(deploymentId)) {
            deploymentId = null;
        }

        if (!_.isEmpty(deploymentId)) {
            if (this.props.data.nodeId) {
                var node = _.find(this.props.data.nodes.items, {id: this.props.data.nodeId});
                if (node.deployment_id !== deploymentId) {
                    this.props.toolbox.getContext().setValue('depNodeId', null);
                    this.props.toolbox.getContext().setValue('nodeId', null);
                }
            }

            if (this.props.data.nodeInstanceId) {
                var nodeInstance = _.find(this.props.data.nodeInstances.items, {id: this.props.data.nodeInstanceId});
                if (nodeInstance.deployment_id !== deploymentId) {
                    this.props.toolbox.getContext().setValue('nodeInstanceId', null);
                }
            }

            // Clear the selected execution if its not related to the selected deployment
            if (this.props.data.executionId) {
                var currExecution = _.find(this.props.data.executions.items,{id:this.props.data.executionId});
                if (currExecution.deployment_id !== deploymentId) {
                    this.props.toolbox.getContext().setValue('executionId',null);
                }
            }
        }

        this.props.toolbox.getContext().setValue('deploymentId',deploymentId);
    }

    _selectNode(proxy, field) {
        var nodeId = field.value;
        if (_.isEmpty(nodeId)) {
            nodeId = null;
        }

        if (this.props.data.nodeInstanceId && !_.isEmpty(nodeId)) {
            var nodeInstance = _.find(this.props.data.nodeInstances.items, {id: this.props.data.nodeInstanceId});
            if (nodeInstance.node_id !== nodeId) {
                this.props.toolbox.getContext().setValue('nodeInstanceId', null);
            }
        }

        this.props.toolbox.getContext().setValue('nodeId', nodeId);
        if (!_.isEmpty(this.props.data.deploymentId)) {
            let depNodeId = nodeId + this.props.data.deploymentId;
            this.props.toolbox.getContext().setValue('depNodeId', depNodeId);
        }
    }

    _selectNodeInstance(proxy, field) {
        var nodeInstanceId = field.value;
        if (_.isEmpty(nodeInstanceId)) {
            nodeInstanceId = null;
        }

        this.props.toolbox.getContext().setValue('nodeInstanceId', nodeInstanceId);
    }

    _selectExecution(proxy, field) {
        var executionId = field.value;
        if (_.isEmpty(executionId)) {
            executionId = null;
        }
        this.props.toolbox.getContext().setValue('executionId',executionId);
    }

    render() {
        var {ErrorMessage, Form} = Stage.Basic;
        const EMPTY_OPTION = {text:'', value:''};

        let blueprintOptions = _.map(this.props.data.blueprints.items, blueprint => {
            return { text: blueprint.id, value: blueprint.id }
        });
        blueprintOptions.unshift(EMPTY_OPTION);

        let deploymentOptions = _.map(this.props.data.deployments.items, deployment => {
            return { text: deployment.id, value: deployment.id }
        });
        deploymentOptions.unshift(EMPTY_OPTION);

        let nodeOptions = _.map(this.props.data.nodes.items, node => {
            return { text: node.id, value: node.id }
        });
        nodeOptions.unshift(EMPTY_OPTION);

        let nodeInstanceOptions = _.map(this.props.data.nodeInstances.items, nodeInstance => {
            return { text: nodeInstance.id, value: nodeInstance.id }
        });
        nodeInstanceOptions.unshift(EMPTY_OPTION);

        let executionOptions = [];
        if (this.props.widget.configuration.filterByExecutions) {
            executionOptions = _.map(this.props.data.executions.items, execution => {
                return {text: execution.id + '-' + execution.workflow_id, value: execution.id}
            });
        }
        executionOptions.unshift(EMPTY_OPTION);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <Form size="small">
                    <Form.Group inline widths='equal'>
                        <Form.Field>
                            <Form.Dropdown search selection value={this.props.data.blueprintId || ''} placeholder="Select Blueprint" fluid
                                           options={blueprintOptions} onChange={this._selectBlueprint.bind(this)} id="blueprintFilterField"/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Dropdown search selection value={this.props.data.deploymentId || ''} placeholder="Select Deployment" fluid
                                           options={deploymentOptions} onChange={this._selectDeployment.bind(this)} id="deploymentFilterField"/>
                        </Form.Field>
                        {
                            this.props.widget.configuration.filterByNodes &&
                            <Form.Field>
                                <Form.Dropdown search selection value={this.props.data.nodeId || ''}
                                               placeholder="Select Node" fluid
                                               options={nodeOptions} onChange={this._selectNode.bind(this)}
                                               id="nodeFilterField"/>
                            </Form.Field>
                        }
                        {
                            this.props.widget.configuration.filterByNodeInstances &&
                            <Form.Field>
                                <Form.Dropdown search selection value={this.props.data.nodeInstanceId || ''} placeholder="Select Node Instance" fluid
                                               options={nodeInstanceOptions} onChange={this._selectNodeInstance.bind(this)} id="nodeInstanceFilterField"/>
                            </Form.Field>
                        }
                        {
                            this.props.widget.configuration.filterByExecutions &&
                            <Form.Field>
                                <Form.Dropdown search selection value={this.props.data.executionId || ''} placeholder="Select Execution" fluid
                                               options={executionOptions} onChange={this._selectExecution.bind(this)} id="executionFilterField"/>
                            </Form.Field>
                        }
                    </Form.Group>
                </Form>
            </div>
        );
    }
}