import type { ComponentProps } from 'react';

interface BlueprintActionButtonsProps {
    blueprintId: string;
    toolbox: Stage.Types.Toolbox;
    showEditCopyInComposerButton: boolean;
}

interface BlueprintActionButtonsState {
    showModal: boolean;
    modalType: string;
    loading: boolean;
    error: any;
    force: boolean;
}

export default class BlueprintActionButtons extends React.Component<
    BlueprintActionButtonsProps,
    BlueprintActionButtonsState
> {
    static DEPLOY_ACTION = 'deploy';

    static DELETE_ACTION = 'delete';

    constructor(props: BlueprintActionButtonsProps) {
        super(props);

        this.state = {
            showModal: false,
            modalType: '',
            loading: false,
            error: null,
            force: false
        };
    }

    shouldComponentUpdate(nextProps: BlueprintActionButtonsProps, nextState: BlueprintActionButtonsState) {
        return !_.isEqual(this.state, nextState) || !_.isMatch(this.props, _.omit(nextProps, 'toolbox'));
    }

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleForceChange: ComponentProps<typeof Stage.Common.DeleteConfirm>['onForceChange'] = (_event, field) => {
        // @ts-expect-error Form.fieldNameValue is not converted to TS yet
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    };

    deleteBlueprint = () => {
        const { blueprintId, toolbox } = this.props;
        const { force } = this.state;
        toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.BlueprintActions(toolbox);

        actions
            // NOTE: If it was undefined, the button would be disabled
            .doDelete(blueprintId!, force)
            .then(() => {
                toolbox.getEventBus().trigger('blueprints:refresh');
                this.setState({ loading: false, error: null });
                this.hideModal();
                toolbox.loading(false);
                if (_.isEqual(blueprintId, toolbox.getContext().getValue('blueprintId'))) {
                    toolbox.getContext().setValue('blueprintId', null);
                }
                toolbox.goToParentPage();
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message });
                this.hideModal();
                toolbox.loading(false);
            });
        return false;
    };

    showModal(type: string) {
        this.setState({ modalType: type, showModal: true, force: false });
    }

    isShowModal(type: string) {
        const { modalType, showModal } = this.state;
        return modalType === type && showModal;
    }

    render() {
        const { blueprintId, toolbox, showEditCopyInComposerButton } = this.props;
        const { error, force, loading } = this.state;
        const { ErrorMessage, Button } = Stage.Basic;
        const { DeleteConfirm, DeployBlueprintModal } = Stage.Common;
        const manager = toolbox.getManager();
        const blueprintActions = new Stage.Common.BlueprintActions(toolbox);

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="rocket"
                    disabled={_.isEmpty(blueprintId) || loading}
                    onClick={() => this.showModal(BlueprintActionButtons.DEPLOY_ACTION)}
                    content="Create deployment"
                    id="createDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={_.isEmpty(blueprintId) || loading}
                    onClick={() => this.showModal(BlueprintActionButtons.DELETE_ACTION)}
                    content="Delete blueprint"
                    id="deleteBlueprintButton"
                />

                {!manager.isCommunityEdition() && showEditCopyInComposerButton && (
                    <Button
                        className="labeled icon"
                        color="teal"
                        icon="external share"
                        disabled={_.isEmpty(blueprintId) || loading}
                        onClick={() => {
                            toolbox.loading(true);
                            this.setState({ loading: true });
                            blueprintActions
                                .doGetBlueprints({ _include: 'main_file_name', id: blueprintId })
                                .then(data =>
                                    new Stage.Common.BlueprintActions(toolbox).doEditInComposer(
                                        // NOTE: If it was undefined, the button would be disabled
                                        blueprintId!,
                                        data.items[0].main_file_name
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
                    open={this.isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                    blueprintId={blueprintId}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={force}
                    open={this.isShowModal(BlueprintActionButtons.DELETE_ACTION)}
                    onConfirm={this.deleteBlueprint}
                    onCancel={this.hideModal}
                    onForceChange={this.handleForceChange}
                    className="blueprintRemoveConfirm"
                />
            </div>
        );
    }
}
