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
        this._hideModal();

        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doDelete(this.props.deployment).then(() => {
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err) => {
            this.setState({error: err.message});
        });
    }

    _showModal(action, workflow) {
        if (workflow) {
            this.setState({workflow});
        }
        this.setState({
            modalType: action,
            showModal: true
        });
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.deploymentId)) {
            let actions = new Stage.Common.DeploymentActions(nextProps.toolbox);
            actions.doGetById(nextProps.deploymentId).then((deployment) => {
                this.setState({deployment});
            }).catch((err) => {
                this.setState({deployment: DeploymentActionButtons.EMPTY_DEPLOYMENT, error: err.message});
            });
        } else {
            this.setState({deployment: DeploymentActionButtons.EMPTY_DEPLOYMENT});
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
                           trigger={<Button className="labeled icon" color="teal" icon="content" disabled={!deploymentId} content="Execute workflow"/>}>
                    <Menu vertical>
                        {
                            this.state.deployment.workflows.map((workflow) => {
                                return
                                    <Menu.Item name={workflow.name} key={workflow.name}
                                               onClick={this._showModal.bind(this, DeploymentActionButtons.WORKFLOW_ACTION, workflow)}>
                                        {_.capitalize(_.lowerCase(workflow.name))}
                                    </Menu.Item>
                            })
                        }
                    </Menu>
                </PopupMenu>

                <Button className="labeled icon" color="teal" icon="edit" disabled={!deploymentId}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.EDIT_ACTION)}
                        content="Update deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!deploymentId}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.DELETE_ACTION)}
                        content="Delete deployment"/>

                <Confirm title={`Are you sure you want to remove deployment ${this.state.deployment.id}?`}
                         show={this.state.modalType === DeploymentActionButtons.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <ExecuteDeploymentModal
                    show={this.state.modalType === DeploymentActionButtons.WORKFLOW_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    workflow={this.state.workflow}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <UpdateDeploymentModal
                    show={this.state.modalType === DeploymentActionButtons.EDIT_ACTION && this.state.showModal}
                    deployment={this.state.deployment}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

            </div>
        );
    }
}
