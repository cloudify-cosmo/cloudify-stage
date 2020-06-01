/**
 * Created by kinneretzin on 02/10/2016.
 */

import BlueprintsCatalog from './BlueprintsCatalog';
import BlueprintsTable from './BlueprintsTable';

export default class BlueprintList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showDeploymentModal: false,
            showUploadModal: false,
            blueprintId: '',
            confirmDelete: false,
            error: null,
            force: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    selectBlueprint(item) {
        const { toolbox, widget } = this.props;
        if (widget.configuration.clickToDrillDown) {
            toolbox.drillDown(widget, 'blueprint', { blueprintId: item.id }, item.id);
        } else {
            const oldSelectedBlueprintId = toolbox.getContext().getValue('blueprintId');
            toolbox.getContext().setValue('blueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
        }
    }

    createDeployment(item) {
        this.setState({ error: null, blueprintId: item.id, showDeploymentModal: true });
    }

    deleteBlueprintConfirm(item) {
        this.setState({ confirmDelete: true, blueprintId: item.id, force: false });
    }

    deleteBlueprint() {
        const { blueprintId, force } = this.state;
        const { toolbox } = this.props;
        if (!blueprintId) {
            this.setState({ error: 'Something went wrong, no blueprint was selected for delete' });
            return;
        }

        const actions = new Stage.Common.BlueprintActions(toolbox);
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
    }

    setBlueprintVisibility(blueprintId, visibility) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.BlueprintActions(toolbox);
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
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprints:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('blueprints:refresh', this.refreshData);
    }

    hideDeploymentModal() {
        this.setState({ showDeploymentModal: false });
    }

    showUploadModal() {
        this.setState({ showUploadModal: true });
    }

    hideUploadModal() {
        this.setState({ showUploadModal: false });
    }

    handleForceChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    fetchGridData(fetchParams) {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    render() {
        const { blueprintId, confirmDelete, error, force, showDeploymentModal, showUploadModal } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Blueprints available. Click "Upload" to add Blueprints.';
        const { Button, ErrorMessage } = Stage.Basic;
        const { DeleteConfirm, DeployBlueprintModal, UploadBlueprintModal } = Stage.Common;

        const shouldShowTable = widget.configuration.displayStyle === 'table';

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Button
                    content="Upload"
                    icon="upload"
                    labelPosition="left"
                    className="uploadBlueprintButton"
                    onClick={this.showUploadModal.bind(this)}
                />

                {shouldShowTable ? (
                    <BlueprintsTable
                        widget={widget}
                        data={data}
                        toolbox={toolbox}
                        fetchGridData={this.fetchGridData.bind(this)}
                        onSelectBlueprint={this.selectBlueprint.bind(this)}
                        onDeleteBlueprint={this.deleteBlueprintConfirm.bind(this)}
                        onCreateDeployment={this.createDeployment.bind(this)}
                        onSetVisibility={this.setBlueprintVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                ) : (
                    <BlueprintsCatalog
                        widget={widget}
                        data={data}
                        toolbox={toolbox}
                        fetchData={this.fetchGridData.bind(this)}
                        onSelectBlueprint={this.selectBlueprint.bind(this)}
                        onDeleteBlueprint={this.deleteBlueprintConfirm.bind(this)}
                        onCreateDeployment={this.createDeployment.bind(this)}
                        onSetVisibility={this.setBlueprintVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                )}

                <DeleteConfirm
                    resourceName={`blueprint ${blueprintId}`}
                    force={force}
                    open={confirmDelete}
                    onConfirm={this.deleteBlueprint.bind(this)}
                    onCancel={() => this.setState({ confirmDelete: false })}
                    onForceChange={this.handleForceChange.bind(this)}
                />

                <DeployBlueprintModal
                    open={showDeploymentModal}
                    blueprintId={blueprintId}
                    onHide={this.hideDeploymentModal.bind(this)}
                    toolbox={toolbox}
                />

                <UploadBlueprintModal
                    open={showUploadModal}
                    onHide={this.hideUploadModal.bind(this)}
                    toolbox={toolbox}
                />
            </div>
        );
    }
}
