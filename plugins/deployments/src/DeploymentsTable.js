/**
 * Created by kinneretzin on 18/10/2016.
 */

import ExecuteWorkflow from './ExecuteWorkflow';
import ExecuteModal from './WorkflowParametersModal';

import Actions from './actions';

export default class extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false,
            showExecuteModal: false
        }
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('deployments:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('deployments:refresh',this._refreshData);
    }

    _initDropdown(dropdown) {
        var thi$ = this;
        $(dropdown).dropdown({
            onChange: (value, text, $choice) => {
                thi$.props.toolbox.getContext().setValue('filterDep'+thi$.props.widget.id,value);
            }
        });

        var filter = this.props.toolbox.getContext().getValue('filterDep'+this.props.widget.id);
        if (filter) {
            $(dropdown).dropdown('set selected',filter);
        }
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

    _deleteDeploymentConfirm(item,event){
        event.stopPropagation();

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

    _showExecuteWorkflowModal (deployment,workflow) {
        this.setState({
            showExecuteModal: true,
            executeDep: deployment,
            executeWorkflow: workflow
        });
    }

    _hideExecuteWorkflowModal() {
        this.setState({
            showExecuteModal: false,
            executeDep: null,
            executeWorkflow: null
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

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Grid = Stage.Basic.Grid;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Grid.Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={true}
                            className="deploymentTable">

                    <Grid.Column label="Name" name="id" width="25%"/>
                    <Grid.Column label="Blueprint" name="blueprint_id" width="25%"/>
                    <Grid.Column label="Created" name="created_at" width="15%"/>
                    <Grid.Column label="Updated" name="updated_at" width="15%"/>
                    <Grid.Column label="Status" width="6%"/>
                    <Grid.Column width="14%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Grid.Row key={item.id} select={item.isSelected} onClick={this._selectDeployment.bind(this, item)}>
                                    <Grid.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                    <Grid.Data>{item.blueprint_id}</Grid.Data>
                                    <Grid.Data>{item.created_at}</Grid.Data>
                                    <Grid.Data>{item.updated_at}</Grid.Data>
                                    <Grid.Data>
                                        { item.status === 'ok' ?
                                            <i className="check circle icon inverted green"></i>
                                            :
                                            <i className="remove circle icon inverted red"></i>
                                        }
                                    </Grid.Data>
                                    <Grid.Data className="center aligned rowActions">
                                        <ExecuteWorkflow item={item} onWorkflowSelected={this._showExecuteWorkflowModal.bind(this)}/>
                                        <i className="write icon link bordered" title="Edit deployment"></i>
                                        <i className="trash icon link bordered" title="Delete deployment" onClick={this._deleteDeploymentConfirm.bind(this,item)}></i>
                                    </Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }

                    <Grid.Filter>
                        <div className="ui selection dropdown" ref={this._initDropdown.bind(this)}>
                            <input type="hidden" name="statusFilter"/>
                            <div className="default text">Filter by status</div>
                            <i className="dropdown icon"></i>
                            <div className="menu">
                                <div className="item" data-value="ok">
                                    <i className="check circle icon inverted green"></i>
                                    OK
                                </div>
                                <div className="item" data-value="error">
                                    <i className="remove circle icon inverted red"></i>
                                    Error
                                </div>
                            </div>
                        </div>
                    </Grid.Filter>

                </Grid.Table>

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
