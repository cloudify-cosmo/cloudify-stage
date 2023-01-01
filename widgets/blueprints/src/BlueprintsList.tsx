import type { ComponentProps } from 'react';

import BlueprintsCatalog from './BlueprintsCatalog';
import BlueprintsTable from './BlueprintsTable';
import type { BlueprintDataResponse, BlueprintsViewProps, BlueprintsWidgetConfiguration } from './types';
import BlueprintUploadActionsMenu from './BlueprintUploadActionsMenu';
import type { Field } from '../../../app/widgets/common/types';

interface BlueprintListProps {
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<BlueprintsWidgetConfiguration>;
    data: BlueprintDataResponse;
}

interface BlueprintListState {
    showDeploymentModal: boolean;
    blueprintId: string;
    confirmDelete: boolean;
    error: any;
    force: boolean;
}

type ForceCheckboxState = Pick<BlueprintListState, 'force'>;

export default class BlueprintList extends React.Component<BlueprintListProps, BlueprintListState> {
    constructor(props: BlueprintListProps) {
        super(props);

        this.state = {
            showDeploymentModal: false,
            blueprintId: '',
            confirmDelete: false,
            error: null,
            force: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprints:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: BlueprintListProps, nextState: BlueprintListState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('blueprints:refresh', this.refreshData);
    }

    selectBlueprint: BlueprintsViewProps['onSelectBlueprint'] = item => {
        const { toolbox, widget } = this.props;
        const BlueprintActions = Stage.Common.Blueprints.Actions;

        if (BlueprintActions.isUploaded(item)) {
            if (widget.configuration.clickToDrillDown) {
                toolbox.drillDown(widget, 'blueprint', { blueprintId: item.id }, item.id);
            } else {
                const oldSelectedBlueprintId = toolbox.getContext().getValue('blueprintId');
                toolbox.getContext().setValue('blueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
            }
        }
    };

    createDeployment: BlueprintsViewProps['onCreateDeployment'] = item => {
        this.setState({ error: null, blueprintId: item.id, showDeploymentModal: true });
    };

    deleteBlueprintConfirm: BlueprintsViewProps['onDeleteBlueprint'] = item => {
        this.setState({ confirmDelete: true, blueprintId: item.id, force: false });
    };

    deleteBlueprint = () => {
        const { blueprintId, force } = this.state;
        const { toolbox } = this.props;
        if (!blueprintId) {
            this.setState({ error: 'Something went wrong, no blueprint was selected for delete' });
            return;
        }

        const actions = new Stage.Common.Blueprints.Actions(toolbox);
        this.setState({ confirmDelete: false });
        actions
            .doDelete(blueprintId, force)
            .then(() => {
                toolbox.getEventBus().trigger('blueprints:refresh');
                this.setState({ error: null });
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };

    setBlueprintVisibility: BlueprintsViewProps['onSetVisibility'] = (blueprintId, visibility) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Blueprints.Actions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(blueprintId, visibility)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                this.setState({ error: err.message });
            });
    };

    hideDeploymentModal = () => {
        this.setState({ showDeploymentModal: false });
    };

    handleForceChange: ComponentProps<typeof Stage.Common.Components.DeleteConfirm>['onForceChange'] = (
        _event,
        field
    ) => {
        this.setState(Stage.Basic.Form.fieldNameValue(field as Field) as ForceCheckboxState);
    };

    fetchGridData: BlueprintsViewProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { blueprintId, confirmDelete, error, force, showDeploymentModal } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Blueprints available. Click "Upload" to add Blueprints.';
        const { ErrorMessage } = Stage.Basic;
        const { DeployBlueprintModal } = Stage.Common;
        const { DeleteConfirm } = Stage.Common.Components;

        const shouldShowTable = widget.configuration.displayStyle === 'table';

        const BlueprintsView = shouldShowTable ? BlueprintsTable : BlueprintsCatalog;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <div className="uploadBlueprintButton">
                    <BlueprintUploadActionsMenu
                        upward={false}
                        direction="left"
                        toolbox={toolbox}
                        showGenerateInComposerButton={
                            !toolbox.getManager().isCommunityEdition() && widget.configuration.showComposerOptions
                        }
                    />
                </div>
                <BlueprintsView
                    widget={widget}
                    data={data}
                    toolbox={toolbox}
                    fetchData={this.fetchGridData}
                    onSelectBlueprint={this.selectBlueprint}
                    onDeleteBlueprint={this.deleteBlueprintConfirm}
                    onCreateDeployment={this.createDeployment}
                    onSetVisibility={this.setBlueprintVisibility}
                    noDataMessage={NO_DATA_MESSAGE}
                />

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={force}
                    open={confirmDelete}
                    onConfirm={this.deleteBlueprint}
                    onCancel={() => this.setState({ confirmDelete: false })}
                    onForceChange={this.handleForceChange}
                />

                <DeployBlueprintModal
                    open={showDeploymentModal}
                    blueprintId={blueprintId}
                    onHide={this.hideDeploymentModal}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}
