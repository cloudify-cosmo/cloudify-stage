/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import ExecuteModal from './ExecuteModal';
import UpdateModal from './UpdateModal';
import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            modalType: "",
            showModal: false,
            deployment: {},
            workflow: {}
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

    _deleteDeployment() {
        this._hideModal();

        if (!this.state.deployment) {
            this._handleError('Something went wrong, no deployment was selected for delete');
            return;
        }

        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.deployment).then(() => {
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
            this.props.toolbox.loading(false);
        }).catch((err) => {
            this._handleError(err.message);
            this.props.toolbox.loading(false);
        });
    }

    _cancelExecution(execution, forceCancel) {
        let actions = new Actions(this.props.toolbox);
        actions.doCancel(execution, forceCancel).then(() => {
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err) => {
            this._handleError(err.message);
        });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _showModal(value, deployment, workflow) {
        this.setState({deployment, workflow:workflow?workflow:{},
                       modalType: workflow?MenuAction.WORKFLOW_ACTION:value, showModal: true});
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(errorMessage) {
        this.setState({error: errorMessage});
    }

    fetchData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var {ErrorMessage, Confirm} = Stage.Basic;

        let showTableComponent = this.props.widget.configuration['displayStyle'] === 'table';

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {showTableComponent ?
                    <DeploymentsTable widget={this.props.widget} data={this.props.data}
                                     fetchData={this.fetchData.bind(this)}
                                     onSelectDeployment={this._selectDeployment.bind(this)}
                                     onMenuAction={this._showModal.bind(this)}
                                     onCancelExecution={this._cancelExecution.bind(this)}
                                     onError={this._handleError.bind(this)} />
                    :
                    <DeploymentsSegment widget={this.props.widget} data={this.props.data}
                                       fetchData={this.fetchData.bind(this)}
                                       onSelectDeployment={this._selectDeployment.bind(this)}
                                       onMenuAction={this._showModal.bind(this)}
                                       onCancelExecution={this._cancelExecution.bind(this)}
                                       onError={this._handleError.bind(this)} />
                }

                <Confirm title={`Are you sure you want to remove deployment ${this.state.deployment.id}?`}
                         show={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <ExecuteModal
                    show={this.state.modalType === MenuAction.WORKFLOW_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    workflow={this.state.workflow}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <UpdateModal
                    show={this.state.modalType === MenuAction.EDIT_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>
            </div>

        );
    }
}
