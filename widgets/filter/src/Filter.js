/**
 * Created by kinneretzin on 27/10/2016.
 */

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
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


    //_selectEvent(item) {
    //    var oldSelectedEventId = this.props.context.getValue('eventId');
    //    this.props.context.setValue('eventId',item.id === oldSelectedEventId ? null : item.id);
    //}

    _selectBlueprint(blueprintId){ //value,text,$choise) {
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

    _selectDeployment(deploymentId) {
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

    _selectExecution(executionId) {
        if (_.isEmpty(executionId)) {
            executionId = null;
        }
        this.props.toolbox.getContext().setValue('executionId',executionId);
    }

    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <div className="ui equal width form">
                    <div className='fields'>
                        <div className='field'>
                            <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectBlueprint.bind(this)})}>
                                <input type="hidden" name="blueprint" value={this.props.data.blueprintId || ''}/>
                                <i className="dropdown icon"></i>
                                <div className="default text">Select Blueprint</div>
                                <div className="menu">
                                    <div className='item' data-value="">Select Blueprint</div>
                                    {
                                        this.props.data.blueprints.items.map((blueprint)=>{
                                            return <div key={blueprint.id} className="item" data-value={blueprint.id}>{blueprint.id}</div>;
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='field'>
                            <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectDeployment.bind(this)})}>
                                <input type="hidden" name="deployment" value={this.props.data.deploymentId || ''}/>
                                <i className="dropdown icon"></i>
                                <div className="default text">Select Deployment</div>
                                <div className="menu">
                                    <div className='item' data-value="">Select Deployment</div>
                                    {
                                        this.props.data.deployments.items.map((deployment)=>{
                                            return <div key={deployment.id} className="item" data-value={deployment.id}>{deployment.id}</div>;
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            this.props.widget.configuration.filterByExecutions &&
                            <div className='field'>
                                <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectExecution.bind(this)})}>
                                    <input type="hidden" name="deployment" value={this.props.data.executionId || ''}/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select Execution</div>
                                    <div className="menu">
                                        <div className='item default' data-value="">Select Execution</div>
                                        {
                                            this.props.data.executions.items.map((execution)=>{
                                                return <div key={execution.id} className="item" data-value={execution.id}>{execution.id + '-' + execution.workflow_id}</div>;
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </div>




            </div>
        );
    }
}