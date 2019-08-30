/**
 * Created by jakubniezgoda on 28/02/2017.
 */

export default class BlueprintActionButtons extends React.Component {
    static DEPLOY_ACTION = 'deploy';

    static DELETE_ACTION = 'delete';

    static EMPTY_BLUEPRINT = { id: '', plan: { inputs: {} } };

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
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.blueprint, nextProps.blueprint)
        );
    }

    _showModal(type) {
        this.setState({ modalType: type, showModal: true, force: false });
    }

    _hideModal() {
        this.setState({ showModal: false });
    }

    _isShowModal(type) {
        return this.state.modalType === type && this.state.showModal;
    }

    _handleForceChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _deleteBlueprint() {
        this.props.toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions
            .doDelete(this.props.blueprint, this.state.force)
            .then(() => {
                this.props.toolbox.getEventBus().trigger('blueprints:refresh');
                this.setState({ loading: false, error: null });
                this._hideModal();
                this.props.toolbox.loading(false);
                if (_.isEqual(this.props.blueprint.id, this.props.toolbox.getContext().getValue('blueprintId'))) {
                    this.props.toolbox.getContext().setValue('blueprintId', null);
                }
                this.props.toolbox.goToParentPage();
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message });
                this._hideModal();
                this.props.toolbox.loading(false);
            });
        return false;
    }

    render() {
        const { ErrorMessage, Button } = Stage.Basic;
        const { DeleteConfirm, DeployBlueprintModal } = Stage.Common;

        const blueprintId = this.props.blueprint.id;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="rocket"
                    disabled={_.isEmpty(blueprintId) || this.state.loading}
                    onClick={this._showModal.bind(this, BlueprintActionButtons.DEPLOY_ACTION)}
                    content="Create deployment"
                    id="createDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={_.isEmpty(blueprintId) || this.state.loading}
                    onClick={this._showModal.bind(this, BlueprintActionButtons.DELETE_ACTION)}
                    content="Delete blueprint"
                    id="deleteBlueprintButton"
                />

                <DeployBlueprintModal
                    open={this._isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                    blueprint={this.props.blueprint}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={this.state.force}
                    open={this._isShowModal(BlueprintActionButtons.DELETE_ACTION)}
                    onConfirm={this._deleteBlueprint.bind(this)}
                    onCancel={this._hideModal.bind(this)}
                    onForceChange={this._handleForceChange.bind(this)}
                    className="blueprintRemoveConfirm"
                />
            </div>
        );
    }
}
