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
            error: null
        }
    }

    _deleteDeployment() {
        this.props.toolbox.loading(true);
        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doDeleteById(this.props.deploymentId).then(() => {
            this.setState({error: null});
            this._hideModal();
            this.props.toolbox.loading(false);
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err) => {
            this.setState({error: err.message});
            this._hideModal();
            this.props.toolbox.loading(false);
        });
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

    componentWillReceiveProps(nextProps) {
        if (this.props.deploymentId !== nextProps.deploymentId) {
            this.props.toolbox.loading(true);
            let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
            actions.doGetById(nextProps.deploymentId).then((deployment) => {
                this.props.toolbox.loading(false);
                this.setState({error: null, deployment});
            }).catch((err) => {
                this.props.toolbox.loading(false);
                this.setState({error: err.message});
            });
        }
    }

    render() {
        let {ErrorMessage, Button, Confirm, PopupMenu, Popup, Menu} = Stage.Basic;
        let {ExecuteDeploymentModal, UpdateDeploymentModal} = Stage.Common;
        let deploymentId = this.props.deploymentId;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <PopupMenu className="workflowAction" disabled={!deploymentId}>
                    <Popup.Trigger>
                        <Button className="labeled icon" color="teal" icon="content"
                                disabled={!deploymentId} content="Execute workflow" />
                    </Popup.Trigger>
                    
                    <Menu vertical>
                        {
                            _.map(this.state.deployment.workflows, (workflow) =>
                                <Menu.Item name={_.capitalize(_.lowerCase(workflow.name))} key={workflow.name}
                                           onClick={this._showExecuteWorkflowModal.bind(this, workflow)} />
                            )
                        }
                    </Menu>
                </PopupMenu>

                <Button className="labeled icon" color="teal" icon="edit" disabled={!deploymentId}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.EDIT_ACTION)}
                        content="Update deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!deploymentId}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.DELETE_ACTION)}
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
