/**
 * Created by kinneretzin on 02/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            force: true,
            confirmDelete: false,
            showUploadModal: false,
            hoveredPlugin: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    selectPlugin(item) {
        const oldSelectedPluginId = this.props.toolbox.getContext().getValue('pluginId');
        if (item.id === oldSelectedPluginId) {
            this.props.toolbox.getContext().setValue('pluginId', null);
        } else {
            this.props.toolbox.getContext().setValue('pluginId', item.id);
        }
    }

    deletePluginConfirm(item, event) {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item,
            force: true
        });
    }

    downloadPlugin(item, event) {
        event.stopPropagation();

        const actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions
            .doDownload(item)
            .then(() => {
                this.setState({ error: null });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    deletePlugin() {
        if (!this.state.item) {
            this.setState({ error: 'Something went wrong, no plugin was selected for delete' });
            return;
        }

        const actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions
            .doDelete(this.state.item, this.state.force)
            .then(() => {
                this.setState({ confirmDelete: false, error: null });
                this.props.toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err => {
                this.setState({ confirmDelete: false, error: err.message });
            });
    }

    setPluginVisibility(pluginId, visibility) {
        const actions = new Stage.Common.PluginActions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions
            .doSetVisibility(pluginId, visibility)
            .then(() => {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.props.toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    showUploadModal() {
        this.setState({ showUploadModal: true });
    }

    hideUploadModal() {
        this.setState({ showUploadModal: false });
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    handleForceChange(event, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('plugins:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('plugins:refresh', this.refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Plugins available. Click "Upload" to add Plugins.';
        const { Button, DataTable, ErrorMessage, ResourceVisibility } = Stage.Basic;
        const { IdPopup } = Stage.Shared;
        const { DeleteConfirm, UploadPluginModal, PluginIcon } = Stage.Common;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData.bind(this)}
                    totalSize={this.props.data.total}
                    pageSize={this.props.widget.configuration.pageSize}
                    sortColumn={this.props.widget.configuration.sortColumn}
                    sortAscending={this.props.widget.configuration.sortAscending}
                    selectable
                    searchable
                    className="pluginsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column name="id" />
                    <DataTable.Column />
                    <DataTable.Column label="Package name" name="package_name" width="20%" />
                    <DataTable.Column label="Package version" name="package_version" width="10%" />
                    <DataTable.Column label="Supported platform" name="supported_platform" width="10%" />
                    <DataTable.Column label="Distribution" name="distribution" width="10%" />
                    <DataTable.Column label="Distribute release" name="distribution_release" width="10%" />
                    <DataTable.Column label="Uploaded at" name="uploaded_at" width="15%" />
                    <DataTable.Column label="Creator" name="created_by" width="15%" />
                    <DataTable.Column width="10%" />

                    {this.props.data.items.map(item => {
                        return (
                            <DataTable.Row
                                key={item.id}
                                selected={item.isSelected}
                                onClick={this.selectPlugin.bind(this, item)}
                                onMouseOver={() =>
                                    this.state.hoveredPlugin !== item.id && this.setState({ hoveredPlugin: item.id })
                                }
                                onMouseOut={() =>
                                    this.state.hoveredPlugin === item.id && this.setState({ hoveredPlugin: null })
                                }
                            >
                                <DataTable.Data>
                                    <IdPopup selected={item.id === this.state.hoveredPlugin} id={item.id} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <PluginIcon src={item.icon} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    {item.package_name}
                                    <ResourceVisibility
                                        visibility={item.visibility}
                                        onSetVisibility={visibility => this.setPluginVisibility(item.id, visibility)}
                                        allowedSettingTo={['tenant', 'global']}
                                        className="rightFloated"
                                    />
                                </DataTable.Data>
                                <DataTable.Data>{item.package_version}</DataTable.Data>
                                <DataTable.Data>{item.supported_platform}</DataTable.Data>
                                <DataTable.Data>{item.distribution}</DataTable.Data>
                                <DataTable.Data>{item.distribution_release}</DataTable.Data>
                                <DataTable.Data>{item.uploaded_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <i
                                        className="download icon link bordered"
                                        title="Download"
                                        onClick={this.downloadPlugin.bind(this, item)}
                                    />
                                    <i
                                        className="trash icon link bordered"
                                        title="Delete"
                                        onClick={this.deletePluginConfirm.bind(this, item)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <Button
                            content="Upload"
                            icon="upload"
                            labelPosition="left"
                            onClick={this.showUploadModal.bind(this)}
                        />
                    </DataTable.Action>
                </DataTable>

                <UploadPluginModal
                    open={this.state.showUploadModal}
                    toolbox={this.props.toolbox}
                    onHide={this.hideUploadModal.bind(this)}
                />

                <DeleteConfirm
                    resourceName={`plugin ${_.get(this.state.item, 'package_name', '')} v${_.get(
                        this.state.item,
                        'package_version',
                        ''
                    )}`}
                    force={this.state.force}
                    open={this.state.confirmDelete}
                    onConfirm={this.deletePlugin.bind(this)}
                    onCancel={() => this.setState({ confirmDelete: false })}
                    onForceChange={this.handleForceChange.bind(this)}
                />
            </div>
        );
    }
}
