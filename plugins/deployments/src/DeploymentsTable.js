/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ExecuteModal from './WorkflowParametersModal';

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete: false,
            showExecuteModal: false,
            advancedFilter: false
        }
    }

    componentDidMount() {
        this.props.context.getEventBus().on('deployments:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('deployments:refresh',this._refreshData);
    }

    _selectDeployment(item) {
        var drillDownConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration,{id:'clickToDrillDown'}) : {};
        if (drillDownConfig && drillDownConfig.value === 'true') {
            this.props.context.setValue('deploymentId',item.id);
            this.props.context.drillDown(this.props.widget,'deployment');
        } else {
            var oldSelectedDeploymentId = this.props.context.getValue('deploymentId');
            this.props.context.setValue('deploymentId',item.id === oldSelectedDeploymentId ? null : item.id);
        }
    }

    _deleteDeploymentConfirm(item){
        this.setState({
            confirmDelete : true,
            deleteDep: item
        });
    }

    _deleteDeployment() {
        if (!this.state.deleteDep) {
            this.setState({error: 'Something went wrong, no deployment was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.context);
        actions.doDelete(this.state.deleteDep).then(()=>{
            this.setState({confirmDelete: false, deleteDep:null});
            this.props.context.getEventBus().trigger('deployments:refresh');
        }).catch((err)=>{
            this.setState({confirmDelete: false, deleteDep: null, error: err.error});
        });
    }

    _refreshData() {
        this.props.context.refresh();
    }

    _selectAction(value, deployment, workflow) {
        if (workflow) {
            this._showExecuteWorkflowModal(deployment, workflow);
        } else if (value === "delete") {
            this._deleteDeploymentConfirm(deployment);
        }
    }

    _showExecuteWorkflowModal(deployment,workflow) {
        this.setState({
            showExecuteModal: true,
            executeDep: deployment,
            executeWorkflow: workflow
        });
    }

    _hideExecuteWorkflowModal() {
        this.setState({
            showExecuteModal: false,
            executeDep: null
        });
    }

    _executeWorkflow(deployment,workflow,params) {
        var actions = new Actions(this.props.context);
        actions.doExecute(deployment,workflow,params).then(()=>{
            this._hideExecuteWorkflowModal();
            this.props.context.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({error: err.error});
        })
    }

    fetchSegmentData(fetchParams) {
        this.props.context.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Segment = Stage.Basic.Segment;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Segment.List totalSize={this.props.data.total}
                              pageSize={this.props.widget.plugin.pageSize}
                              fetchData={this.fetchSegmentData.bind(this)}>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Segment.Item key={item.id} select={item.isSelected}
                                              onClick={this._selectDeployment.bind(this, item)}>
                                    <div className="ui grid">
                                        <div className="four wide center aligned column rightDivider">
                                            <h3 className="ui icon header">
                                                <div className="content">
                                                    {item.id}
                                                </div>
                                                <i className="check circle outline icon"></i>
                                            </h3>
                                        </div>
                                        <div className="two wide column">
                                            <h5 className="ui icon header">Blueprint</h5>
                                            <p>{item.blueprint_id}</p>
                                        </div>
                                        <div className="two wide column">
                                            <h5 className="ui icon header">Created</h5>
                                            <p>{item.created_at}</p>
                                        </div>
                                        <div className="two wide column">
                                            <h5 className="ui icon header">Updated</h5>
                                            <p>{item.updated_at}</p>
                                        </div>
                                        <div className="four wide column">
                                            <h5 className="ui icon header">Nodes ({item.nodeSize})</h5>
                                            <div className="ui five column grid">
                                                <div className="column center aligned">
                                                    <NodeState icon="spinner" title="uninitialized" value={item.nodeStates.uninitialized}/>
                                                </div>
                                                <div className="column center aligned">
                                                    <NodeState icon="plus" title="created" value={item.nodeStates.created}/>
                                                </div>
                                                <div className="column center aligned">
                                                    <NodeState icon="remove" title="deleted" value={item.nodeStates.deleted}/>
                                                </div>
                                                <div className="column center aligned">
                                                    <NodeState icon="warning" title="stopped" value={item.nodeStates.stopped}/>
                                                </div>
                                                <div className="column center aligned">
                                                    <NodeState icon="checkmark" title="started" value={item.nodeStates.started}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="two wide column action">
                                            <MenuAction item={item} onSelectAction={this._selectAction.bind(this)}/>
                                        </div>
                                    </div>
                                </Segment.Item>
                            );
                        })
                    }
                </Segment.List>

                <Confirm title='Are you sure you want to remove this deployment?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

                <ExecuteModal
                    show={this.state.showExecuteModal}
                    deployment={this.state.executeDep}
                    workflow={this.state.executeWorkflow}
                    onExecute={this._executeWorkflow.bind(this)}
                    onCancel={this._hideExecuteWorkflowModal.bind(this)}/>
            </div>

        );
    }
}

function NodeState(props) {
    return (
        <div className="ui compact segments nodeState" title={props.title}>
            <div className="ui segment orange inverted">
                <i className={`${props.icon} icon`}></i>
            </div>
            <div className="ui segment orange tertiary inverted">{props.value?props.value:0}</div>
        </div>
    )
}