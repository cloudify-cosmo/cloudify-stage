/**
 * Created by kinneretzin on 18/10/2016.
 */

import ExecuteModal from './WorkflowParametersModal';
import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';

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
        if (this.props.widget.configuration.clickToDrillDown) {
            this.props.toolbox.drillDown(this.props.widget,'deployment',{deploymentId: item.id}, item.id);
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

    fetchData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        var showTableComponent = this.props.widget.configuration['displayStyle'] === 'table';

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {showTableComponent ?
                    <DeploymentsTable widget={this.props.widget} data={this.props.data}
                                     fetchData={this.fetchData.bind(this)}
                                     onSelectDeployment={this._selectDeployment.bind(this)}
                                     onMenuAction={this._selectAction.bind(this)}/>
                    :
                    <DeploymentsSegment widget={this.props.widget} data={this.props.data}
                                       fetchData={this.fetchData.bind(this)}
                                       onSelectDeployment={this._selectDeployment.bind(this)}
                                       onMenuAction={this._selectAction.bind(this)}/>
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
