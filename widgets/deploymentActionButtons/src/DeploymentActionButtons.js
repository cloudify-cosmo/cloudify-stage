/**
 * Created by jakubniezgoda on 01/03/2017.
 */

export default class DeploymentActionButtons extends React.Component {

    static EDIT_ACTION = 'edit';
    static DELETE_ACTION = 'delete';
    static WORKFLOW_ACTION = 'workflow';

    static EMPTY_DEPLOYMENT = {id: '', workflows: []};
    static EMPTY_WORKFLOW = {name: '', parameters: []};

    constructor(props,context) {
        super(props,context);

        this.state = {
            showModal: false,
            modalType: '',
            deployment: DeploymentActionButtons.EMPTY_DEPLOYMENT,
            workflow: DeploymentActionButtons.EMPTY_WORKFLOW,
            loading: false,
            error: null
        }
    }

    _deleteDeployment() {
        this.setState({loading: true});
        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doDeleteById(this.props.deploymentId).then(() => {
            this.setState({loading: false, error: null});
            this._hideModal();
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err) => {
            this.setState({loading: false, error: err.message});
            this._hideModal();
        });
    }

    _showDeleteDeploymentModal() {
        this._showModal(DeploymentActionButtons.DELETE_ACTION);
    }

    _showUpdateDeploymentModal() {
        this._getDeploymentAndShowModal(this.props.deploymentId, DeploymentActionButtons.EDIT_ACTION);
    }

    _showExecuteWorkflowModal(workflow) {
        this.setState({workflow})
        this._showModal(DeploymentActionButtons.WORKFLOW_ACTION);
    }

    _showModal(type) {
        this.setState({modalType: type, showModal: true});
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _isShowModal(type) {
        return this.state.modalType === type && this.state.showModal;
    }

    _getDeploymentAndShowModal(deploymentId, modalType) {
        this.setState({loading: true});
        if (!_.isEmpty(deploymentId)) {
            let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
            actions.doGetById(deploymentId).then((deployment) => {
                this.setState({loading: false, deployment});
                this._showModal(modalType);
            }).catch((err) => {
                this.setState({loading: false, error: err.message});
            });
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        let {ErrorMessage, Button, Confirm, PopupMenu, Menu} = Stage.Basic;
        let {ExecuteDeploymentModal, UpdateDeploymentModal} = Stage.Common;
        let deploymentId = this.props.deploymentId;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <PopupMenu className="workflowAction" disabled={!deploymentId}
                           trigger={<Button className="labeled icon" color="teal" icon="content"
                                            onClick={this._getDeploymentAndShowModal.bind(this, deploymentId, null)}
                                            disabled={!deploymentId} content="Execute workflow"
                                            loading={this.state.loading} />}>
                    <Menu vertical>
                        {
                            _.map(this.state.deployment.workflows, (workflow) =>
                                <Menu.Item name={_.capitalize(_.lowerCase(workflow.name))} key={workflow.name}
                                           onClick={this._showExecuteWorkflowModal.bind(this, workflow)} />
                            )
                        }
                    </Menu>
                </PopupMenu>

                <Button className="labeled icon" color="teal" icon="edit" disabled={!deploymentId} loading={this.state.loading}
                        onClick={this._showUpdateDeploymentModal.bind(this)}
                        content="Update deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!deploymentId}
                        onClick={this._showDeleteDeploymentModal.bind(this)}
                        content="Delete deployment"/>

                <Confirm title={`Are you sure you want to remove deployment ${this.props.deploymentId}?`}
                         show={this._isShowModal(DeploymentActionButtons.DELETE_ACTION)}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <ExecuteDeploymentModal
                    show={this._isShowModal(DeploymentActionButtons.WORKFLOW_ACTION)}
                    deployment={this.state.deployment}
                    workflow={this.state.workflow}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <UpdateDeploymentModal
                    show={this._isShowModal(DeploymentActionButtons.EDIT_ACTION)}
                    deployment={this.state.deployment}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

            </div>
        );
    }
}
