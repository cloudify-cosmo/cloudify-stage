/**
 * Created by jakubniezgoda on 01/03/2017.
 */

export default class DeploymentActionButtons extends React.Component {
    static EDIT_ACTION = 'edit';

    static DELETE_ACTION = 'delete';

    static WORKFLOW_ACTION = 'workflow';

    static EMPTY_DEPLOYMENT = { id: '', workflows: [] };

    static EMPTY_WORKFLOW = { name: '', parameters: {} };

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            workflow: DeploymentActionButtons.EMPTY_WORKFLOW,
            loading: false,
            error: null
        };

        this.showExecuteWorkflowModal = this.showExecuteWorkflowModal.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { deployment, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(deployment, nextProps.deployment)
        );
    }

    deleteDeployment = () => {
        const { deployment, toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doDelete(deployment)
            .then(() => {
                this.setState({ loading: false, error: null });
                this.hideModal();
                toolbox.loading(false);
                toolbox.getEventBus().trigger('deployments:refresh');
                if (_.isEqual(deployment.id, toolbox.getContext().getValue('deploymentId'))) {
                    toolbox.getContext().setValue('deploymentId', null);
                }
                toolbox.goToParentPage();
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message });
                this.hideModal();
                toolbox.loading(false);
            });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    showExecuteWorkflowModal(workflow) {
        this.setState({ workflow });
        this.showModal(DeploymentActionButtons.WORKFLOW_ACTION);
    }

    showModal(type) {
        this.setState({ modalType: type, showModal: true });
    }

    isShowModal(type) {
        const { modalType, showModal } = this.state;
        return modalType === type && showModal;
    }

    render() {
        const { error, loading, workflow } = this.state;
        const { deployment, toolbox } = this.props;
        const { Button, Confirm, ErrorMessage } = Stage.Basic;
        const { ExecuteDeploymentModal, UpdateDeploymentModal, WorkflowsMenu } = Stage.Common;
        const deploymentId = deployment.id;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <WorkflowsMenu
                    workflows={deployment.workflows}
                    dropdownDirection="right"
                    trigger={
                        <Button
                            className="labeled icon"
                            color="teal"
                            icon="cogs"
                            id="executeWorkflowButton"
                            disabled={_.isEmpty(deploymentId) || loading}
                            content="Execute workflow"
                        />
                    }
                    onClick={this.showExecuteWorkflowModal}
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="edit"
                    disabled={_.isEmpty(deploymentId) || loading}
                    onClick={() => this.showModal(DeploymentActionButtons.EDIT_ACTION)}
                    content="Update deployment"
                    id="updateDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={_.isEmpty(deploymentId) || loading}
                    onClick={() => this.showModal(DeploymentActionButtons.DELETE_ACTION)}
                    content="Delete deployment"
                    id="deleteDeploymentButton"
                />

                <Confirm
                    content={`Are you sure you want to remove deployment ${deploymentId}?`}
                    open={this.isShowModal(DeploymentActionButtons.DELETE_ACTION)}
                    onConfirm={this.deleteDeployment}
                    onCancel={this.hideModal}
                    className="deploymentRemoveConfirm"
                />

                <ExecuteDeploymentModal
                    open={this.isShowModal(DeploymentActionButtons.WORKFLOW_ACTION)}
                    deployment={deployment}
                    workflow={workflow}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <UpdateDeploymentModal
                    open={this.isShowModal(DeploymentActionButtons.EDIT_ACTION)}
                    deployment={deployment}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}

DeploymentActionButtons.propTypes = {
    deployment: PropTypes.shape({ id: PropTypes.string, workflows: PropTypes.arrayOf(PropTypes.shape({})) }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
