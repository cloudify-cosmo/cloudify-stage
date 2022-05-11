import type { ComponentProps } from 'react';

const t = Stage.Utils.getT('widgets.blueprintActionButtons.buttons');

const modalType = {
    DEPLOY: 'deploy',
    DELETE: 'delete'
} as const;

type modalType = typeof modalType[keyof typeof modalType];

interface BlueprintActionButtonsProps {
    blueprintId: string;
    toolbox: Stage.Types.Toolbox;
    showEditCopyInComposerButton: boolean;
}

interface BlueprintActionButtonsState {
    showModal: boolean;
    modalType?: modalType;
    loading: boolean;
    error: any;
    force: boolean;
}

export default class BlueprintActionButtons extends React.Component<
    BlueprintActionButtonsProps,
    BlueprintActionButtonsState
> {
    constructor(props: BlueprintActionButtonsProps) {
        super(props);

        this.state = {
            showModal: false,
            loading: false,
            error: null,
            force: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const openDeploymentModal = toolbox.getContext().getValue('openDeploymentModal');

        if (openDeploymentModal) {
            this.showDeployModal();
        }
    }

    shouldComponentUpdate(nextProps: BlueprintActionButtonsProps, nextState: BlueprintActionButtonsState) {
        return !_.isEqual(this.state, nextState) || !_.isMatch(this.props, _.omit(nextProps, 'toolbox'));
    }

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleForceChange: ComponentProps<typeof Stage.Common.Components.DeleteConfirm>['onForceChange'] = (
        _event,
        field
    ) => {
        // @ts-expect-error Form.fieldNameValue is not converted to TS yet
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    };

    deleteBlueprint = () => {
        const { blueprintId, toolbox } = this.props;
        const { force } = this.state;
        toolbox.loading(true);
        this.setState({ loading: true });
        const actions = new Stage.Common.Blueprints.Actions(toolbox);

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

    downloadBlueprint = () => {
        const { toolbox, blueprintId } = this.props;
        const blueprintDownloadUrl = `/blueprints/${blueprintId}/archive`;
        const blueprintFileName = `${blueprintId}.zip`;

        toolbox.getManager().doDownload(blueprintDownloadUrl, blueprintFileName);
    };

    showDeployModal = () => {
        this.showModal(modalType.DEPLOY);
    };

    showDeleteModal = () => {
        this.showModal(modalType.DELETE);
    };

    clearErrors = () => {
        this.setState({ error: null });
    };

    isShowModal(type: modalType) {
        const { modalType, showModal } = this.state;
        return modalType === type && showModal;
    }

    showModal(type: modalType) {
        this.setState({ modalType: type, showModal: true, force: false });
    }

    render() {
        const { blueprintId, toolbox, showEditCopyInComposerButton } = this.props;
        const { error, force, loading } = this.state;
        const { ErrorMessage, Button } = Stage.Basic;
        const { DeployBlueprintModal } = Stage.Common;
        const { DeleteConfirm } = Stage.Common.Components;
        const manager = toolbox.getManager();
        const blueprintActions = new Stage.Common.Blueprints.Actions(toolbox);
        const disableButtons = _.isEmpty(blueprintId) || loading;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={this.clearErrors} autoHide />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="rocket"
                    disabled={disableButtons}
                    onClick={this.showDeployModal}
                    content={t('createDeployment')}
                    id="createDeploymentButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="trash"
                    disabled={disableButtons}
                    onClick={this.showDeleteModal}
                    content={t('deleteBlueprint')}
                    id="deleteBlueprintButton"
                />

                <Button
                    className="labeled icon"
                    color="teal"
                    icon="download"
                    disabled={disableButtons}
                    onClick={this.downloadBlueprint}
                    content={t('downloadBlueprint')}
                    id="downloadBlueprintButton"
                />

                {!manager.isCommunityEdition() && showEditCopyInComposerButton && (
                    <Button
                        className="labeled icon"
                        color="teal"
                        icon="external share"
                        disabled={disableButtons}
                        onClick={() => {
                            toolbox.loading(true);
                            this.setState({ loading: true });
                            blueprintActions
                                .doGetBlueprints({ _include: 'main_file_name', id: blueprintId })
                                .then(data =>
                                    new Stage.Common.Blueprints.Actions(toolbox).doEditInComposer(
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
                        content={t('editCopy')}
                    />
                )}

                <DeployBlueprintModal
                    open={this.isShowModal(modalType.DEPLOY)}
                    blueprintId={blueprintId}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={force}
                    open={this.isShowModal(modalType.DELETE)}
                    onConfirm={this.deleteBlueprint}
                    onCancel={this.hideModal}
                    onForceChange={this.handleForceChange}
                    className="blueprintRemoveConfirm"
                />
            </div>
        );
    }
}
