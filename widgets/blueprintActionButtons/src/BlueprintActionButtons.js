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
        return !_.isEqual(this.state, nextState) || !_.isMatch(this.props, _.omit(nextProps, 'toolbox'));
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
            .doDelete(this.props.blueprintId, this.state.force)
            .then(() => {
                this.props.toolbox.getEventBus().trigger('blueprints:refresh');
                this.setState({ loading: false, error: null });
                this._hideModal();
                this.props.toolbox.loading(false);
                if (_.isEqual(this.props.blueprintId, this.props.toolbox.getContext().getValue('blueprintId'))) {
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
        const { blueprintId, toolbox } = this.props;
        const manager = toolbox.getManager();

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

                {!manager.isCommunityEdition() && (
                    <Button
                        className="labeled icon"
                        color="teal"
                        icon="external share"
                        disabled={_.isEmpty(blueprintId) || this.state.loading}
                        onClick={() => {
                            toolbox.loading(true);
                            this.setState({ loading: true });
                            manager
                                .doGet('/blueprints?_include=main_file_name', { id: blueprintId })
                                .then(data =>
                                    window.open(
                                        `/composer/import/${manager.getSelectedTenant()}/${blueprintId}/${
                                            data.items[0].main_file_name
                                        }`,
                                        '_blank'
                                    )
                                )
                                .finally(() => {
                                    toolbox.loading(false);
                                    this.setState({ loading: false });
                                });
                        }}
                        content="Edit a copy in Composer"
                    />
                )}

                <DeployBlueprintModal
                    open={this._isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                    blueprintId={blueprintId}
                    onHide={this._hideModal.bind(this)}
                    toolbox={toolbox}
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
