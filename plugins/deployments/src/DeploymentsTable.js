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
        this.props.toolbox.getEventBus().on('deployments:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('deployments:refresh',this._refreshData);
    }

    _selectDeployment(item) {
        var drillDownConfig = this.props.widget.configuration.clickToDrillDown;
        if (drillDownConfig === 'true') {
            this.props.toolbox.getContext().setValue('deploymentId',item.id);
            this.props.toolbox.drillDown(this.props.widget,'deployment');
        } else {
            var oldSelectedDeploymentId = this.props.toolbox.getContext().getValue('deploymentId');
            this.props.toolbox.getContext().setValue('deploymentId',item.id === oldSelectedDeploymentId ? null : item.id);
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

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.deleteDep).then(()=>{
            this.setState({confirmDelete: false, deleteDep:null});
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err)=>{
            this.setState({confirmDelete: false, deleteDep: null, error: err.error});
        });
    }

    _refreshData() {
        this.props.toolbox.refresh();
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
        var actions = new Actions(this.props.toolbox);
        actions.doExecute(deployment,workflow,params).then(()=>{
            this._hideExecuteWorkflowModal();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({error: err.error});
        })
    }

    fetchSegmentData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Segment = Stage.Basic.Segment;
        var Grid = Stage.Basic.Grid;

        var showOldComponent = this.props.widget.configuration['displayComponent'] === 'old';

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {!showOldComponent ?

                    <Segment.List totalSize={this.props.data.total}
                                  pageSize={this.props.widget.plugin.pageSize}
                                  fetchData={this.fetchSegmentData.bind(this)}>
                        {
                            this.props.data.items.map((item) => {
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
                                                        <NodeState icon="spinner" title="uninitialized"
                                                                   value={item.nodeStates.uninitialized}/>
                                                    </div>
                                                    <div className="column center aligned">
                                                        <NodeState icon="plus" title="created"
                                                                   value={item.nodeStates.created}/>
                                                    </div>
                                                    <div className="column center aligned">
                                                        <NodeState icon="remove" title="deleted"
                                                                   value={item.nodeStates.deleted}/>
                                                    </div>
                                                    <div className="column center aligned">
                                                        <NodeState icon="warning" title="stopped"
                                                                   value={item.nodeStates.stopped}/>
                                                    </div>
                                                    <div className="column center aligned">
                                                        <NodeState icon="checkmark" title="started"
                                                                   value={item.nodeStates.started}/>
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
                    :
                    <Grid.Table fetchData={this.fetchSegmentData.bind(this)}
                                totalSize={this.props.data.total}
                                pageSize={this.props.widget.plugin.pageSize}
                                selectable={true}
                                className="deploymentTable">

                        <Grid.Column label="Name" name="id" width="25%"/>
                        <Grid.Column label="Blueprint" name="blueprint_id" width="25%"/>
                        <Grid.Column label="Created" name="created_at" width="18%"/>
                        <Grid.Column label="Updated" name="updated_at" width="18%"/>
                        <Grid.Column width="14%"/>

                        {
                            this.props.data.items.map((item)=>{
                                return (
                                    <Grid.Row key={item.id} select={item.isSelected} onClick={this._selectDeployment.bind(this, item)}>
                                        <Grid.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                        <Grid.Data>{item.blueprint_id}</Grid.Data>
                                        <Grid.Data>{item.created_at}</Grid.Data>
                                        <Grid.Data>{item.updated_at}</Grid.Data>
                                        <Grid.Data className="center aligned rowActions">
                                            <MenuAction item={item} bordered={true} onSelectAction={this._selectAction.bind(this)}/>
                                            <i className="write icon link bordered" title="Edit deployment"></i>
                                            <i className="trash icon link bordered" title="Delete deployment" onClick={this._deleteDeploymentConfirm.bind(this,item)}></i>
                                        </Grid.Data>
                                    </Grid.Row>
                                );
                            })
                        }
                    </Grid.Table>
                }


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