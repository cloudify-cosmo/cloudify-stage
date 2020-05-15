/**
 * Created by kinneretzin on 02/10/2016.
 */

import BlueprintsTable from './BlueprintsTable';
import BlueprintsCatalog from './BlueprintsCatalog';

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
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    selectBlueprint(item) {
        if (this.props.widget.configuration.clickToDrillDown) {
            this.props.toolbox.drillDown(this.props.widget, 'blueprint', { blueprintId: item.id }, item.id);
        } else {
            const oldSelectedBlueprintId = this.props.toolbox.getContext().getValue('blueprintId');
            this.props.toolbox
                .getContext()
                .setValue('blueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
        }
    }

    createDeployment(item) {
        this.setState({ error: null, blueprintId: item.id, showDeploymentModal: true });
    }

    deleteBlueprintConfirm(item) {
        this.setState({ confirmDelete: true, blueprintId: item.id, force: false });
    }

    deleteBlueprint() {
        if (!this.state.blueprintId) {
            this.setState({ error: 'Something went wrong, no blueprint was selected for delete' });
            return;
        }

        const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        this.setState({ confirmDelete: false });
        actions
            .doDelete(this.state.blueprintId, this.state.force)
            .then(() => {
                this.setState({ error: null });
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    setBlueprintVisibility(blueprintId, visibility) {
        const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions
            .doSetVisibility(blueprintId, visibility)
            .then(() => {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.props.toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprints:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh', this.refreshData);
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
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Blueprints available. Click "Upload" to add Blueprints.';
        const { Button, ErrorMessage } = Stage.Basic;
        const { DeleteConfirm, DeployBlueprintModal, UploadBlueprintModal } = Stage.Common;

        const shouldShowTable = this.props.widget.configuration.displayStyle === 'table';

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Button
                    content="Upload"
                    icon="upload"
                    labelPosition="left"
                    className="uploadBlueprintButton"
                    onClick={this.showUploadModal.bind(this)}
                />

                {shouldShowTable ? (
                    <BlueprintsTable
                        widget={this.props.widget}
                        data={this.props.data}
                        toolbox={this.props.toolbox}
                        fetchGridData={this.fetchGridData.bind(this)}
                        onSelectBlueprint={this.selectBlueprint.bind(this)}
                        onDeleteBlueprint={this.deleteBlueprintConfirm.bind(this)}
                        onCreateDeployment={this.createDeployment.bind(this)}
                        onSetVisibility={this.setBlueprintVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                ) : (
                    <BlueprintsCatalog
                        widget={this.props.widget}
                        data={this.props.data}
                        toolbox={this.props.toolbox}
                        fetchData={this.fetchGridData.bind(this)}
                        onSelectBlueprint={this.selectBlueprint.bind(this)}
                        onDeleteBlueprint={this.deleteBlueprintConfirm.bind(this)}
                        onCreateDeployment={this.createDeployment.bind(this)}
                        onSetVisibility={this.setBlueprintVisibility.bind(this)}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                )}

                <DeleteConfirm
                    resourceName={`blueprint ${this.state.blueprintId}`}
                    force={this.state.force}
                    open={this.state.confirmDelete}
                    onConfirm={this.deleteBlueprint.bind(this)}
                    onCancel={() => this.setState({ confirmDelete: false })}
                    onForceChange={this.handleForceChange.bind(this)}
                />

                <DeployBlueprintModal
                    open={this.state.showDeploymentModal}
                    blueprintId={this.state.blueprintId}
                    onHide={this.hideDeploymentModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <UploadBlueprintModal
                    open={this.state.showUploadModal}
                    onHide={this.hideUploadModal.bind(this)}
                    toolbox={this.props.toolbox}
                />
            </div>
        );
    }
}
