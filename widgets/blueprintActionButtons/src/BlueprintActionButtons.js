/**
 * Created by jakubniezgoda on 28/02/2017.
 */

export default class BlueprintActionButtons extends React.Component {
    static DEPLOY_ACTION = 'deploy';

    static DELETE_ACTION = 'delete';

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            modalType: '',
            loading: false,
            error: null,
            force: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState) || !_.isEqual(this.props.blueprintId, nextProps.blueprintId);
    }

    showModal(type) {
        this.setState({ modalType: type, showModal: true, force: false });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    isShowModal(type) {
        return this.state.modalType === type && this.state.showModal;
    }

    handleForceChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    deleteBlueprint() {
        this.props.toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions
            .doDelete(this.props.blueprintId, this.state.force)
            .then(() => {
                this.props.toolbox.getEventBus().trigger('blueprints:refresh');
                this.setState({ loading: false, error: null });
                this.hideModal();
                this.props.toolbox.loading(false);
                if (_.isEqual(this.props.blueprintId, this.props.toolbox.getContext().getValue('blueprintId'))) {
                    this.props.toolbox.getContext().setValue('blueprintId', null);
                }
                this.props.toolbox.goToParentPage();
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message });
                this.hideModal();
                this.props.toolbox.loading(false);
            });
        return false;
    }

    render() {
        const { ErrorMessage, Button } = Stage.Basic;
        const { DeleteConfirm, DeployBlueprintModal } = Stage.Common;

        const { blueprintId } = this.props;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="rocket"
                    disabled={_.isEmpty(blueprintId) || this.state.loading}
                    onClick={this.showModal.bind(this, BlueprintActionButtons.DEPLOY_ACTION)}
                    content="Create deployment"
                    id="createDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={_.isEmpty(blueprintId) || this.state.loading}
                    onClick={this.showModal.bind(this, BlueprintActionButtons.DELETE_ACTION)}
                    content="Delete blueprint"
                    id="deleteBlueprintButton"
                />

                <DeployBlueprintModal
                    open={this.isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                    blueprintId={blueprintId}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={this.state.force}
                    open={this.isShowModal(BlueprintActionButtons.DELETE_ACTION)}
                    onConfirm={this.deleteBlueprint.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    onForceChange={this.handleForceChange.bind(this)}
                    className="blueprintRemoveConfirm"
                />
            </div>
        );
    }
}
