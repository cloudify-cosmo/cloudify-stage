import type { ComponentProps } from 'react';
import { Button } from 'semantic-ui-react';

import BlueprintsCatalog from './BlueprintsCatalog';
import BlueprintsTable from './BlueprintsTable';
import type { BlueprintDataResponse, BlueprintsViewProps, BlueprintsWidgetConfiguration } from './types';
import BlueprintUploadActionsMenu from './BlueprintUploadActionsMenu';

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
        // @ts-expect-error Form.fieldNameValue is not converted to TS yet
        this.setState(Stage.Basic.Form.fieldNameValue(field));
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
        const { ErrorMessage, Dropdown } = Stage.Basic;
        const { DeployBlueprintModal } = Stage.Common;
        const { DeleteConfirm } = Stage.Common.Components;

        const shouldShowTable = widget.configuration.displayStyle === 'table';

        const BlueprintsView = shouldShowTable ? BlueprintsTable : BlueprintsCatalog;

        return (
            <div>
                <h1>Basic</h1>
                <Button content="Hey" />
                <Button color="blue" content="Hey" />
                <Button color="yellow" content="Hey" />
                <Button color="red" content="Hey" />
                <Button color="brown" content="Hey" />
                <Button color="green" content="Hey" />
                <Button color="teal" content="Hey" />
                <Button color="blue" content="Hey" icon="rocket" />
                <h1>Basic disabled</h1>
                <Button content="Hey" disabled />
                <Button color="blue" content="Hey" disabled />
                <Button color="yellow" content="Hey" disabled />
                <Button color="red" content="Hey" disabled />
                <Button color="brown" content="Hey" disabled />
                <Button color="green" content="Hey" disabled />
                <Button color="teal" content="Hey" disabled />
                <Button color="blue" content="Hey" disabled icon="rocket" />
                <h1>Hollow</h1>
                <Button content="Hey" basic />
                <Button color="blue" content="Hey" basic />
                <Button color="red" content="Hey" basic />
                <Button color="green" content="Hey" basic />
                <Button color="blue" content="Hey" basic icon="rocket" />
                <h1>Hollow Disabled</h1>
                <Button content="Hey" basic disabled />
                <Button color="blue" content="Hey" basic disabled />
                <Button color="red" content="Hey" basic disabled />
                <Button color="green" content="Hey" basic disabled />
                <Button color="blue" content="Hey" basic disabled icon="rocket" />
                <h1>Dropdown</h1>
                <Dropdown button text="Hey">
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown button text="Hey" className="red">
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown button text="Hey" className="blue">
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <h1>Dropdown disabled</h1>
                <Dropdown button text="Hey" disabled>
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown button text="Hey" className="red" disabled>
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown button text="Hey" className="blue" disabled>
                    <Dropdown.Menu>
                        <Dropdown.Item text="test_1" key="test_1" />
                        <Dropdown.Item text="test_2" key="test_2" />
                        <Dropdown.Item text="test_3" key="test_3" />
                    </Dropdown.Menu>
                </Dropdown>
                <br />
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
