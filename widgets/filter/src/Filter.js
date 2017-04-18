/**
 * Created by kinneretzin on 27/10/2016.
 */

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprints:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('deployments:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('executions:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('deployments:refresh', this._refreshData);
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
        // Clear the selected execution if its not related to the selected deployment
        if (this.props.data.executionId && !_.isEmpty(deploymentId)) {
            var currExecution = _.find(this.props.data.executions.items,{id:this.props.data.executionId});
            if (currExecution.deployment_id !== deploymentId) {
                this.props.toolbox.getContext().setValue('executionId',null);
            }
        }
        this.props.toolbox.getContext().setValue('deploymentId',deploymentId);

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

        let executionOptions = [];
        if (this.props.widget.configuration.filterByExecutions) {
            executionOptions = _.map(this.props.data.executions.items, execution => {
                return {text: execution.id + '-' + execution.workflow_id, value: execution.id}
            });
        }
        executionOptions.unshift(EMPTY_OPTION);

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Form.Dropdown search selection value={this.props.data.blueprintId || ''} placeholder="Select Blueprint"
                                           options={blueprintOptions} onChange={this._selectBlueprint.bind(this)}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Dropdown search selection value={this.props.data.deploymentId || ''} placeholder="Select Deployment"
                                           options={deploymentOptions} onChange={this._selectDeployment.bind(this)}/>
                        </Form.Field>
                        {
                            this.props.widget.configuration.filterByExecutions &&
                            <Form.Field>
                                <Form.Dropdown search selection value={this.props.data.executionId || ''} placeholder="Select Execution"
                                               options={executionOptions} onChange={this._selectExecution.bind(this)}/>
                            </Form.Field>
                        }
                    </Form.Group>
                </Form>
            </div>
        );
    }
}