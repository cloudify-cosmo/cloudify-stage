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
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('blueprints:refresh', this._refreshData, this);
        this.props.context.getEventBus().on('deployments:refresh', this._refreshData, this);
        this.props.context.getEventBus().on('executions:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('blueprints:refresh', this._refreshData);
        this.props.context.getEventBus().off('deployments:refresh', this._refreshData);
        this.props.context.getEventBus().off('executions:refresh', this._refreshData);
    }


    //_selectEvent(item) {
    //    var oldSelectedEventId = this.props.context.getValue('eventId');
    //    this.props.context.setValue('eventId',item.id === oldSelectedEventId ? null : item.id);
    //}

    _selectBlueprint(blueprintId){ //value,text,$choise) {
        this.props.context.setValue('blueprintId',blueprintId);
    }

    _selectDeployment(deploymentId) {
        this.props.context.setValue('deploymentId',deploymentId);
    }

    _selectExecution(executionId) {
        this.props.context.setValue('executionId',executionId);
    }

    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var FilterByExecutionsConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration,{id:'FilterByExecutions'}) : {};
        var shouldShowExecutionsFilter = FilterByExecutionsConfig && FilterByExecutionsConfig.value === 'true';

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <div className="ui equal width form">
                    <div className='fields'>
                        <div className='field'>
                            <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectBlueprint.bind(this)})}>
                                <input type="hidden" name="blueprint"/>
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
                                <input type="hidden" name="deployment"/>
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
                            shouldShowExecutionsFilter ?
                                <div className='field'>
                                    <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectExecution.bind(this)})}>
                                        <input type="hidden" name="deployment"/>
                                        <i className="dropdown icon"></i>
                                        <div className="default text">Select Execution</div>
                                        <div className="menu">
                                            <div className='item' data-value="">Select Execution</div>
                                            {
                                                this.props.data.executions.items.map((execution)=>{
                                                    return <div key={execution.id} className="item" data-value={execution.id}>{execution.id + '-' + execution.workflow_id}</div>;
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            :
                                ''
                        }

                    </div>
                </div>




            </div>
        );
    }
}