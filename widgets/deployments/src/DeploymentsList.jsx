/**
 * Created by kinneretzin on 18/10/2016.
 */

import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';
import MenuAction from './MenuAction';
import SetSiteModal from './SetSiteModal';

export default class DeploymentsList extends React.Component {
    static DEPLOYMENT_UPDATE_DETAILS_MODAL = 'deploymentUpdateDetailsModal';

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

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    setDeploymentVisibility = (deploymentId, visibility) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.DeploymentActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(deploymentId, visibility)
            .then(() => toolbox.refresh())
            .catch(err => this.setState({ error: err.message }))
            .finally(() => toolbox.loading(false));
    };

    setError = errorMessage => {
        this.setState({ error: errorMessage });
    };

    selectDeployment = item => {
        const { toolbox, widget } = this.props;
        if (widget.configuration.clickToDrillDown) {
            toolbox.drillDown(widget, 'deployment', { deploymentId: item.id }, item.id);
        } else {
            const oldSelectedDeploymentId = toolbox.getContext().getValue('deploymentId');
            toolbox.getContext().setValue('deploymentId', item.id === oldSelectedDeploymentId ? null : item.id);
        }
    };

    deleteDeployment = () => {
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
    };

    forceDeleteDeployment = () => {
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
    };

    actOnExecution = (execution, action, error) => {
        this.setError(error);
    };

    showModal = (value, deployment, workflow) => {
        this.setState({
            deployment,
            workflow: workflow || {},
            modalType: workflow ? MenuAction.WORKFLOW_ACTION : value,
            showModal: true
        });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    fetchData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { deployment, error, modalType, showModal, workflow } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Deployments available. Click "Create deployment" to add deployments.';
        const { ErrorMessage, Confirm } = Stage.Basic;
        const { ExecuteDeploymentModal, UpdateDeploymentModal } = Stage.Common;
        const showTableComponent = widget.configuration.displayStyle === 'table';

        const DeploymentsView = showTableComponent ? DeploymentsTable : DeploymentsSegment;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DeploymentsView
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    onSelectDeployment={this.selectDeployment}
                    onMenuAction={this.showModal}
                    onActOnExecution={this.actOnExecution}
                    onError={this.setError}
                    onSetVisibility={this.setDeploymentVisibility}
                    noDataMessage={NO_DATA_MESSAGE}
                    showExecutionStatusLabel={widget.configuration.showExecutionStatusLabel}
                    toolbox={toolbox}
                />

                <Confirm
                    content={`Are you sure you want to remove deployment ${deployment.id}?`}
                    open={modalType === MenuAction.DELETE_ACTION && showModal}
                    onConfirm={this.deleteDeployment}
                    onCancel={this.hideModal}
                />

                <Confirm
                    content={
                        <div className="content">
                            <p>
                                Force delete will ignore any existing live nodes, or existing deployments which depend
                                on this deployment.
                            </p>
                            <p>
                                It&apos;s recommended to first run uninstall to stop the live nodes, and make sure there
                                are no running installations which depend on this deployment - and then run delete.
                            </p>
                            <p>
                                Are you sure you want to ignore the live nodes and delete the deployment {deployment.id}
                                ?
                            </p>
                        </div>
                    }
                    open={modalType === MenuAction.FORCE_DELETE_ACTION && showModal}
                    onConfirm={this.forceDeleteDeployment}
                    onCancel={this.hideModal}
                />

                <ExecuteDeploymentModal
                    open={modalType === MenuAction.WORKFLOW_ACTION && showModal}
                    deployment={deployment}
                    workflow={workflow}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <UpdateDeploymentModal
                    open={modalType === MenuAction.UPDATE_ACTION && showModal}
                    deployment={deployment}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <SetSiteModal
                    open={modalType === MenuAction.SET_SITE_ACTION && showModal}
                    deployment={deployment}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}

DeploymentsList.propTypes = {
    data: PropTypes.shape({}).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
