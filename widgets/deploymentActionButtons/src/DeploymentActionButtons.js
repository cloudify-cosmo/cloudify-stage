/**
 * Created by jakubniezgoda on 01/03/2017.
 */

export default class DeploymentActionButtons extends React.Component {
    static EDIT_ACTION = 'edit';

    static DELETE_ACTION = 'delete';

    static WORKFLOW_ACTION = 'workflow';

    static EMPTY_DEPLOYMENT = { id: '', workflows: [] };

    static EMPTY_WORKFLOW = { name: '', parameters: [] };

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            workflow: DeploymentActionButtons.EMPTY_WORKFLOW,
            loading: false,
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.deployment, nextProps.deployment)
        );
    }

    deleteDeployment() {
        this.props.toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions
            .doDelete(this.props.deployment)
            .then(() => {
                this.setState({ loading: false, error: null });
                this.hideModal();
                this.props.toolbox.loading(false);
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                if (_.isEqual(this.props.deployment.id, this.props.toolbox.getContext().getValue('deploymentId'))) {
                    this.props.toolbox.getContext().setValue('deploymentId', null);
                }
                this.props.toolbox.goToParentPage();
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message });
                this.hideModal();
                this.props.toolbox.loading(false);
            });
    }

    showExecuteWorkflowModal(workflow) {
        this.setState({ workflow });
        this.showModal(DeploymentActionButtons.WORKFLOW_ACTION);
    }

    showModal(type) {
        this.setState({ modalType: type, showModal: true });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    isShowModal(type) {
        return this.state.modalType === type && this.state.showModal;
    }

    render() {
        const { Button, Confirm, ErrorMessage } = Stage.Basic;
        const { ExecuteDeploymentModal, UpdateDeploymentModal, WorkflowsMenu } = Stage.Common;
        const deploymentId = this.props.deployment.id;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <WorkflowsMenu
                    workflows={this.props.deployment.workflows}
                    dropdownDirection="right"
                    trigger={
                        <Button
                            className="labeled icon"
                            color="teal"
                            icon="cogs"
                            id="executeWorkflowButton"
                            disabled={_.isEmpty(deploymentId) || this.state.loading}
                            content="Execute workflow"
                        />
                    }
                    onClick={workflow => this.showExecuteWorkflowModal(workflow)}
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="edit"
                    disabled={_.isEmpty(deploymentId) || this.state.loading}
                    onClick={this.showModal.bind(this, DeploymentActionButtons.EDIT_ACTION)}
                    content="Update deployment"
                    id="updateDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={_.isEmpty(deploymentId) || this.state.loading}
                    onClick={this.showModal.bind(this, DeploymentActionButtons.DELETE_ACTION)}
                    content="Delete deployment"
                    id="deleteDeploymentButton"
                />

                <Confirm
                    content={`Are you sure you want to remove deployment ${deploymentId}?`}
                    open={this.isShowModal(DeploymentActionButtons.DELETE_ACTION)}
                    onConfirm={this.deleteDeployment.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    className="deploymentRemoveConfirm"
                />

                <ExecuteDeploymentModal
                    open={this.isShowModal(DeploymentActionButtons.WORKFLOW_ACTION)}
                    deployment={this.props.deployment}
                    workflow={this.state.workflow}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <UpdateDeploymentModal
                    open={this.isShowModal(DeploymentActionButtons.EDIT_ACTION)}
                    deployment={this.props.deployment}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />
            </div>
        );
    }
}
