/**
 * Created by kinneretzin on 18/10/2016.
 */

import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';
import MenuAction from './MenuAction';
import SetSiteModal from './SetSiteModal';

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
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    selectDeployment(item) {
        const { toolbox, widget } = this.props;
        if (widget.configuration.clickToDrillDown) {
            toolbox.drillDown(widget, 'deployment', { deploymentId: item.id }, item.id);
        } else {
            const oldSelectedDeploymentId = toolbox.getContext().getValue('deploymentId');
            toolbox.getContext().setValue('deploymentId', item.id === oldSelectedDeploymentId ? null : item.id);
        }
    }

    showLogs(deploymentId, executionId) {
        const { toolbox, widget } = this.props;
        toolbox.drillDown(widget, 'logs', { deploymentId, executionId }, `Execution Logs - ${executionId}`);
    }

    deleteDeployment() {
        const { deployment } = this.state;
        const { toolbox } = this.props;
        this.hideModal();

        if (!deployment) {
            this.setError('Something went wrong, no deployment was selected for delete');
            return;
        }

        toolbox.loading(true);

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doDelete(deployment)
            .then(() => {
                this.setError(null);
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.loading(false);
            })
            .catch(err => {
                this.setError(err.message);
                toolbox.loading(false);
            });
    }

    forceDeleteDeployment() {
        const { deployment } = this.state;
        const { toolbox } = this.props;
        this.hideModal();

        if (!deployment) {
            this.setError('Something went wrong, no deployment was selected for delete');
            return;
        }

        toolbox.loading(true);

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doForceDelete(deployment)
            .then(() => {
                this.setError(null);
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.loading(false);
            })
            .catch(err => {
                this.setError(err.message);
                toolbox.loading(false);
            });
    }

    actOnExecution(execution, action) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.ExecutionActions(toolbox);
        actions
            .doAct(execution, action)
            .then(() => {
                this.setError(null);
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch(err => {
                this.setError(err.message);
            });
    }

    setDeploymentVisibility(deploymentId, visibility) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.DeploymentActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(deploymentId, visibility)
            .then(() => toolbox.refresh())
            .catch(err => this.setState({ error: err.message }))
            .finally(() => toolbox.loading(false));
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
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
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    render() {
        const { deployment, deploymentUpdateId, error, modalType, showModal, workflow } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Deployments available. Click "Create deployment" to add deployments.';
        const { ErrorMessage, Confirm } = Stage.Basic;
        const { ExecuteDeploymentModal, UpdateDeploymentModal, UpdateDetailsModal } = Stage.Common;
        const showTableComponent = widget.configuration.displayStyle === 'table';

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showTableComponent ? (
                    <DeploymentsTable
                        widget={widget}
                        data={data}
                        fetchData={this.fetchData.bind(this)}
                        onSelectDeployment={this.selectDeployment.bind(this)}
                        onShowLogs={this.showLogs.bind(this)}
                        onShowUpdateDetails={this.showDeploymentUpdateDetailsModal.bind(this)}
                        onMenuAction={this.showModal.bind(this)}
                        onActOnExecution={this.actOnExecution.bind(this)}
                        onError={this.setError.bind(this)}
                        onSetVisibility={this.setDeploymentVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                        showExecutionStatusLabel={widget.configuration.showExecutionStatusLabel}
                    />
                ) : (
                    <DeploymentsSegment
                        widget={widget}
                        data={data}
                        fetchData={this.fetchData.bind(this)}
                        onSelectDeployment={this.selectDeployment.bind(this)}
                        onShowLogs={this.showLogs.bind(this)}
                        onShowUpdateDetails={this.showDeploymentUpdateDetailsModal.bind(this)}
                        onMenuAction={this.showModal.bind(this)}
                        onActOnExecution={this.actOnExecution.bind(this)}
                        onError={this.setError.bind(this)}
                        onSetVisibility={this.setDeploymentVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                        showExecutionStatusLabel={widget.configuration.showExecutionStatusLabel}
                    />
                )}

                <Confirm
                    content={`Are you sure you want to remove deployment ${deployment.id}?`}
                    open={modalType === MenuAction.DELETE_ACTION && showModal}
                    onConfirm={this.deleteDeployment.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content={`Its recommended to first run uninstall to stop the live nodes, and then run delete.
                                   Force delete will ignore any existing live nodes.
                                   Are you sure you want to ignore the live nodes and delete the deployment ${deployment.id}?`}
                    open={modalType === MenuAction.FORCE_DELETE_ACTION && showModal}
                    onConfirm={this.forceDeleteDeployment.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <ExecuteDeploymentModal
                    open={modalType === MenuAction.WORKFLOW_ACTION && showModal}
                    deployment={deployment}
                    workflow={workflow}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <UpdateDeploymentModal
                    open={modalType === MenuAction.UPDATE_ACTION && showModal}
                    deployment={deployment}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <UpdateDetailsModal
                    open={modalType === DeploymentsList.DEPLOYMENT_UPDATE_DETAILS_MODAL && showModal}
                    deploymentUpdateId={deploymentUpdateId}
                    onClose={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <SetSiteModal
                    open={modalType === MenuAction.SET_SITE_ACTION && showModal}
                    deployment={deployment}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}
