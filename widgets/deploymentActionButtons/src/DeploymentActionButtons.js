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
            workflow: DeploymentActionButtons.EMPTY_WORKFLOW,
            loading: false,
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.deployment, nextProps.deployment);
    }

    _deleteDeployment() {
        this.props.toolbox.loading(true);
        this.setState({loading: true});
        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doDelete(this.props.deployment).then(() => {
            this.setState({loading: false, error: null});
            this._hideModal();
            this.props.toolbox.loading(false);
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err) => {
            this.setState({loading: false, error: err.message});
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

    render() {
        let {ErrorMessage, Button, Confirm, PopupMenu, Popup, Menu} = Stage.Basic;
        let {ExecuteDeploymentModal, UpdateDeploymentModal} = Stage.Common;
        let deploymentId = this.props.deployment.id;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <PopupMenu className="workflowAction" position="bottom center" offset={0}>
                    <Popup.Trigger>
                        <Button className="labeled icon" color="teal" icon="content"
                                disabled={_.isEmpty(deploymentId) || this.state.loading} content="Execute workflow" />
                    </Popup.Trigger>
                    
                    <Menu vertical>
                        {
                            _.map(this.props.deployment.workflows, (workflow) =>
                                <Menu.Item name={_.capitalize(_.lowerCase(workflow.name))} key={workflow.name}
                                           onClick={this._showExecuteWorkflowModal.bind(this, workflow)} />
                            )
                        }
                    </Menu>
                </PopupMenu>

                <Button className="labeled icon" color="teal" icon="edit" disabled={_.isEmpty(deploymentId) || this.state.loading}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.EDIT_ACTION)}
                        content="Update deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={_.isEmpty(deploymentId) || this.state.loading}
                        onClick={this._showModal.bind(this, DeploymentActionButtons.DELETE_ACTION)}
                        content="Delete deployment"/>

                <Confirm content={`Are you sure you want to remove deployment ${deploymentId}?`}
                         open={this._isShowModal(DeploymentActionButtons.DELETE_ACTION)}
                         onConfirm={this._deleteDeployment.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <ExecuteDeploymentModal
                    open={this._isShowModal(DeploymentActionButtons.WORKFLOW_ACTION)}
                    deployment={this.props.deployment}
                    workflow={this.state.workflow}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <UpdateDeploymentModal
                    open={this._isShowModal(DeploymentActionButtons.EDIT_ACTION)}
                    deployment={this.props.deployment}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

            </div>
        );
    }
}
