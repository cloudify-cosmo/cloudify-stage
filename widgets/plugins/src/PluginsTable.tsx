// @ts-nocheck File not migrated fully to TS
import MarketplaceModal from './MarketplaceModal';

const t = Stage.Utils.getT('widgets.plugins');

interface PluginItem {
    /* eslint-disable camelcase */
    created_by: string;
    distribution: string;
    distribution_release: string;
    icon: string;
    id: string;
    isSelected: boolean;
    title: string;
    package_name: string;
    package_version: string;
    supported_platform: string;
    uploaded_at: string;
    visibility: string;
    /* eslint-enable camelcase */
}

interface PluginsTableProps {
    data: {
        items: PluginItem[];
        total: number;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget;
}

interface PluginsTableState {
    error: string | null;
    force: boolean;
    confirmDelete: boolean;
    item: PluginItem | null;
    showPackageUploadModal: boolean;
    showMarketplaceUploadModal: boolean;
    hoveredPlugin: string | null;
}

export default class PluginsTable extends React.Component<PluginsTableProps, PluginsTableState> {
    constructor(props: PluginsTableProps, context: any) {
        super(props, context);

        this.state = {
            error: null,
            force: false,
            confirmDelete: false,
            item: null,
            showPackageUploadModal: false,
            showMarketplaceUploadModal: false,
            hoveredPlugin: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('plugins:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: PluginsTableProps, nextState: PluginsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('plugins:refresh', this.refreshData);
    }

    handleForceChange = (_event, field) => {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    };

    setPluginVisibility = (pluginId: string, visibility: string) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.PluginActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(pluginId, visibility)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                this.setState({ error: err.message });
            });
    };

    setHoveredPlugin = (idToCheck: string) => {
        const { hoveredPlugin } = this.state;
        if (hoveredPlugin !== idToCheck) {
            this.setState({ hoveredPlugin: idToCheck });
        }
    };

    unsetHoveredPlugin = (idToCheck: string) => {
        const { hoveredPlugin } = this.state;
        if (hoveredPlugin === idToCheck) {
            this.setState({ hoveredPlugin: null });
        }
    };

    selectPlugin = (item: PluginItem) => {
        const { toolbox } = this.props;
        const oldSelectedPluginId = toolbox.getContext().getValue('pluginId');
        if (item.id === oldSelectedPluginId) {
            toolbox.getContext().setValue('pluginId', null);
        } else {
            toolbox.getContext().setValue('pluginId', item.id);
        }
    };

    deletePluginConfirm = (item: PluginItem, event: Event) => {
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item,
            force: false
        });
    };

    downloadPlugin = (item: PluginItem, event: Event) => {
        event.stopPropagation();
        const { toolbox } = this.props;
        const actions = new Stage.Common.PluginActions(toolbox);
        actions
            .doDownload(item)
            .then(() => {
                this.setState({ error: null });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };

    deletePlugin = () => {
        const { force, item } = this.state;
        const { toolbox } = this.props;
        if (!item) {
            this.setState({ error: 'Something went wrong, no plugin was selected for delete' });
            return;
        }

        const actions = new Stage.Common.PluginActions(toolbox);
        actions
            .doDelete(item, force)
            .then(() => {
                this.setState({ confirmDelete: false, error: null });
                toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err => {
                this.setState({ confirmDelete: false, error: err.message });
            });
    };

    showPackageUploadModal = () => {
        this.setState({ showPackageUploadModal: true });
    };

    hidePackageUploadModal = () => {
        this.setState({ showPackageUploadModal: false });
    };

    showMarketplaceUploadModal = () => {
        this.setState({ showMarketplaceUploadModal: true });
    };

    hideMarketplaceUploadModal = () => {
        this.setState({ showMarketplaceUploadModal: false });
    };

    refreshData = () => {
        const { toolbox } = this.props;
        toolbox.refresh();
    };

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    render() {
        const {
            confirmDelete,
            error,
            force,
            hoveredPlugin,
            item: selectedPlugin,
            showPackageUploadModal,
            showMarketplaceUploadModal
        } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Plugins available. Click "Upload" to add Plugins.';
        const { DataTable, Dropdown, ErrorMessage, Icon, ResourceVisibility } = Stage.Basic;
        const { IdPopup, VerticallyAlignedCell } = Stage.Shared;
        const { DeleteConfirm, UploadPluginModal, PluginIcon } = Stage.Common;
        const { Item, Menu } = Dropdown;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    selectable
                    searchable
                    className="pluginsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column name="id" />
                    <DataTable.Column />
                    <DataTable.Column label="Plugin" name="title" width="20%" />
                    <DataTable.Column label="Package name" name="package_name" width="20%" />
                    <DataTable.Column label="Package version" name="package_version" width="10%" />
                    <DataTable.Column label="Supported platform" name="supported_platform" width="10%" />
                    <DataTable.Column label="Distribution" name="distribution" width="10%" />
                    <DataTable.Column label="Distribute release" name="distribution_release" width="10%" />
                    <DataTable.Column label="Uploaded at" name="uploaded_at" width="15%" />
                    <DataTable.Column label="Creator" name="created_by" width="15%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(item => {
                        return (
                            <DataTable.Row
                                key={item.id}
                                selected={item.isSelected}
                                onClick={() => this.selectPlugin(item)}
                                onMouseOver={() => this.setHoveredPlugin(item.id)}
                                onMouseOut={() => this.unsetHoveredPlugin(item.id)}
                            >
                                <DataTable.Data>
                                    <IdPopup selected={item.id === hoveredPlugin} id={item.id} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <PluginIcon src={item.icon} />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <VerticallyAlignedCell>
                                        {item.title || item.package_name}
                                        <ResourceVisibility
                                            visibility={item.visibility}
                                            onSetVisibility={visibility =>
                                                this.setPluginVisibility(item.id, visibility)
                                            }
                                            allowedSettingTo={['tenant', 'global']}
                                            className="rightFloated"
                                        />
                                    </VerticallyAlignedCell>
                                </DataTable.Data>
                                <DataTable.Data>{item.package_name}</DataTable.Data>
                                <DataTable.Data>{item.package_version}</DataTable.Data>
                                <DataTable.Data>{item.supported_platform}</DataTable.Data>
                                <DataTable.Data>{item.distribution}</DataTable.Data>
                                <DataTable.Data>{item.distribution_release}</DataTable.Data>
                                <DataTable.Data>{item.uploaded_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        name="download"
                                        link
                                        bordered
                                        title="Download"
                                        onClick={(event: Event) => this.downloadPlugin(item, event)}
                                    />
                                    <Icon
                                        name="trash"
                                        link
                                        bordered
                                        title="Delete"
                                        onClick={(event: Event) => this.deletePluginConfirm(item, event)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <Dropdown icon="upload" button className="icon" labeled text={t('upload.button')}>
                            <Menu direction="left">
                                <Item text={t('upload.marketplace')} onClick={this.showMarketplaceUploadModal} />
                                <Item text={t('upload.package')} onClick={this.showPackageUploadModal} />
                            </Menu>
                        </Dropdown>
                    </DataTable.Action>
                </DataTable>

                <UploadPluginModal
                    open={showPackageUploadModal}
                    toolbox={toolbox}
                    onHide={this.hidePackageUploadModal}
                />

                <MarketplaceModal open={showMarketplaceUploadModal} onHide={this.hideMarketplaceUploadModal} />

                <DeleteConfirm
                    resourceName={`plugin ${_.get(selectedPlugin, 'package_name', '')} v${_.get(
                        selectedPlugin,
                        'package_version',
                        ''
                    )}`}
                    force={force}
                    open={confirmDelete}
                    onConfirm={this.deletePlugin}
                    onCancel={() => this.setState({ confirmDelete: false })}
                    onForceChange={this.handleForceChange}
                />
            </div>
        );
    }
}
