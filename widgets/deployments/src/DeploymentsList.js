/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import SetSiteModal from './SetSiteModal';
import DeploymentsTable from './DeploymentsTable';
import DeploymentsSegment from './DeploymentsSegment';

export default class DeploymentsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            modalType: '',
            showModal: false,
            deployment: {},
            deploymentUpdateId: null,
            workflow: {}
        };
    }

    static DEPLOYMENT_UPDATE_DETAILS_MODAL = 'deploymentUpdateDetailsModal';

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    selectDeployment(item) {
        if (this.props.widget.configuration.clickToDrillDown) {
            this.props.toolbox.drillDown(this.props.widget, 'deployment', { deploymentId: item.id }, item.id);
        } else {
            const oldSelectedDeploymentId = this.props.toolbox.getContext().getValue('deploymentId');
            this.props.toolbox
                .getContext()
                .setValue('deploymentId', item.id === oldSelectedDeploymentId ? null : item.id);
        }
    }

    showLogs(deploymentId, executionId) {
        this.props.toolbox.drillDown(
            this.props.widget,
            'logs',
            { deploymentId, executionId },
            `Execution Logs - ${executionId}`
        );
    }

    deleteDeployment() {
        this.hideModal();

        if (!this.state.deployment) {
            this.setError('Something went wrong, no deployment was selected for delete');
            return;
        }

        this.props.toolbox.loading(true);

        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions
            .doDelete(this.state.deployment)
            .then(() => {
                this.setError(null);
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.toolbox.loading(false);
            })
            .catch(err => {
                this.setError(err.message);
                this.props.toolbox.loading(false);
            });
    }

    forceDeleteDeployment() {
        this.hideModal();

        if (!this.state.deployment) {
            this.setError('Something went wrong, no deployment was selected for delete');
            return;
        }

        this.props.toolbox.loading(true);

        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions
            .doForceDelete(this.state.deployment)
            .then(() => {
                this.setError(null);
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.toolbox.loading(false);
            })
            .catch(err => {
                this.setError(err.message);
                this.props.toolbox.loading(false);
            });
    }

    actOnExecution(execution, action) {
        const actions = new Stage.Common.ExecutionActions(this.props.toolbox);
        actions
            .doAct(execution, action)
            .then(() => {
                this.setError(null);
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch(err => {
                this.setError(err.message);
            });
    }

    setDeploymentVisibility(deploymentId, visibility) {
        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions
            .doSetVisibility(deploymentId, visibility)
            .then(() => {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.props.toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    showModal(value, deployment, workflow) {
        this.setState({
            deployment,
            workflow: workflow || {},
            modalType: workflow ? MenuAction.WORKFLOW_ACTION : value,
            showModal: true
        });
    }

    showDeploymentUpdateDetailsModal(deploymentUpdateId) {
        this.setState({
            deploymentUpdateId,
            modalType: DeploymentsList.DEPLOYMENT_UPDATE_DETAILS_MODAL,
            showModal: true
        });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    setError(errorMessage) {
        this.setState({ error: errorMessage });
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Deployments available. Click "Create deployment" to add deployments.';
        const { ErrorMessage, Confirm } = Stage.Basic;
        const { ExecuteDeploymentModal, UpdateDeploymentModal, UpdateDetailsModal } = Stage.Common;
        const showTableComponent = this.props.widget.configuration.displayStyle === 'table';

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showTableComponent ? (
                    <DeploymentsTable
                        widget={this.props.widget}
                        data={this.props.data}
                        fetchData={this.fetchData.bind(this)}
                        onSelectDeployment={this.selectDeployment.bind(this)}
                        onShowLogs={this.showLogs.bind(this)}
                        onShowUpdateDetails={this.showDeploymentUpdateDetailsModal.bind(this)}
                        onMenuAction={this.showModal.bind(this)}
                        onActOnExecution={this.actOnExecution.bind(this)}
                        onError={this.setError.bind(this)}
                        onSetVisibility={this.setDeploymentVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                        showExecutionStatusLabel={this.props.widget.configuration.showExecutionStatusLabel}
                    />
                ) : (
                    <DeploymentsSegment
                        widget={this.props.widget}
                        data={this.props.data}
                        fetchData={this.fetchData.bind(this)}
                        onSelectDeployment={this.selectDeployment.bind(this)}
                        onShowLogs={this.showLogs.bind(this)}
                        onShowUpdateDetails={this.showDeploymentUpdateDetailsModal.bind(this)}
                        onMenuAction={this.showModal.bind(this)}
                        onActOnExecution={this.actOnExecution.bind(this)}
                        onError={this.setError.bind(this)}
                        onSetVisibility={this.setDeploymentVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                        showExecutionStatusLabel={this.props.widget.configuration.showExecutionStatusLabel}
                    />
                )}

                <Confirm
                    content={`Are you sure you want to remove deployment ${this.state.deployment.id}?`}
                    open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                    onConfirm={this.deleteDeployment.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content={`Its recommended to first run uninstall to stop the live nodes, and then run delete.
                                   Force delete will ignore any existing live nodes.
                                   Are you sure you want to ignore the live nodes and delete the deployment ${this.state.deployment.id}?`}
                    open={this.state.modalType === MenuAction.FORCE_DELETE_ACTION && this.state.showModal}
                    onConfirm={this.forceDeleteDeployment.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <ExecuteDeploymentModal
                    open={this.state.modalType === MenuAction.WORKFLOW_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    workflow={this.state.workflow}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <UpdateDeploymentModal
                    open={this.state.modalType === MenuAction.UPDATE_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <UpdateDetailsModal
                    open={
                        this.state.modalType === DeploymentsList.DEPLOYMENT_UPDATE_DETAILS_MODAL && this.state.showModal
                    }
                    deploymentUpdateId={this.state.deploymentUpdateId}
                    onClose={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <SetSiteModal
                    open={this.state.modalType === MenuAction.SET_SITE_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />
            </div>
        );
    }
}
