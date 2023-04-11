import type { FunctionComponent } from 'react';
import { useState } from 'react';
import MarketplaceModal from './MarketplaceModal';
import type { FetchedPluginItem, PluginsWidget } from './widget.types';

const translate = Stage.Utils.getT('widgets.plugins');

interface PluginItem extends FetchedPluginItem {
    isSelected: boolean;
}

interface PluginsTableProps {
    data: {
        items: PluginItem[];
        total: number;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<PluginsWidget.Configuration>;
}

const PluginsTable: FunctionComponent<PluginsTableProps> = ({ data, toolbox, widget }) => {
    const { useBoolean, useResettableState, useInput, useRefreshEvent } = Stage.Hooks;
    const [confirmDeleteShown, showConfirmDelete, hideConfirmDelete] = useBoolean();
    const [error, setError, clearError] = useResettableState<string | null>(null);
    const [force, setForce, clearForce] = useInput<boolean>(false);
    const [hoveredPlugin, setHoveredPlugin, clearHoveredPlugin] = useResettableState(null);
    const [packageUploadModalShown, showPackageUploadModal, hidePackageUploadModal] = useBoolean();
    const [marketplaceUploadModalShown, showMarketplaceUploadModal, hideMarketplaceUploadModal] = useBoolean();
    const [selectedPlugin, setSelectedPlugin] = useState<PluginItem | null>(null);

    useRefreshEvent(toolbox, 'plugins:refresh');
    function fetchGridData(fetchParams: any) {
        return toolbox.refresh(fetchParams);
    }

    function selectPlugin(item: PluginItem) {
        const oldSelectedPluginId = toolbox.getContext().getValue('pluginId');
        if (item.id === oldSelectedPluginId) {
            toolbox.getContext().setValue('pluginId', null);
        } else {
            toolbox.getContext().setValue('pluginId', item.id);
        }
    }

    function setPluginVisibility(pluginId: string, visibility: string) {
        const actions = new Stage.Common.Plugins.Actions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(pluginId, visibility)
            .then(() => toolbox.refresh())
            .catch(err => setError(err.message))
            .finally(() => toolbox.loading(false));
    }

    function downloadPlugin(item: PluginItem, event: Event) {
        event.stopPropagation();
        const actions = new Stage.Common.Plugins.Actions(toolbox);
        actions
            .doDownload(item)
            .then(clearError)
            .catch(err => setError(err.message));
    }

    function deletePluginConfirm(item: PluginItem, event: Event) {
        event.stopPropagation();

        showConfirmDelete();
        setSelectedPlugin(item);
        clearForce();
    }

    function deletePlugin() {
        if (!selectedPlugin) {
            setError(translate('deleteError'));
            return;
        }

        const actions = new Stage.Common.Plugins.Actions(toolbox);
        actions
            .doDelete(selectedPlugin, force)
            .then(() => {
                clearError();
                toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(hideConfirmDelete);
    }

    const { DataTable, Dropdown, ErrorMessage, Icon, ResourceVisibility } = Stage.Basic;
    const { IdPopup } = Stage.Shared;
    const { DeleteConfirm } = Stage.Common.Components;
    const { UploadModal, Icon: PluginIcon } = Stage.Common.Plugins;
    const { allowedVisibilitySettings } = Stage.Common.Consts;
    const { Item, Menu } = Dropdown;

    return (
        <div>
            <ErrorMessage error={error} onDismiss={clearError} autoHide />

            <DataTable
                fetchData={fetchGridData}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                sortColumn={widget.configuration.sortColumn}
                sortAscending={widget.configuration.sortAscending}
                selectable
                searchable
                className="pluginsTable"
                noDataMessage={translate('noData')}
            >
                <DataTable.Column name="id" />
                <DataTable.Column />
                <DataTable.Column label={translate('columns.plugin')} name="title" width="20%" />
                <DataTable.Column label={translate('columns.packageName')} name="package_name" width="20%" />
                <DataTable.Column label={translate('columns.packageVersion')} name="package_version" width="5%" />
                <DataTable.Column
                    label={translate('columns.supportedPlatform')}
                    name="supported_platform"
                    width="10%"
                />
                <DataTable.Column label={translate('columns.distribution')} name="distribution" width="10%" />
                <DataTable.Column
                    label={translate('columns.distributionRelease')}
                    name="distribution_release"
                    width="10%"
                />
                <DataTable.Column label={translate('columns.uploadedAt')} name="uploaded_at" width="10%" />
                <DataTable.Column label={translate('columns.creator')} name="created_by" width="10%" />
                <DataTable.Column width="10%" />

                {data.items.map(item => {
                    return (
                        <DataTable.Row
                            key={item.id}
                            selected={item.isSelected}
                            onClick={() => selectPlugin(item)}
                            onMouseOver={setHoveredPlugin as any} // TODO(RD-6366) Set hovered state properly
                            onMouseOut={clearHoveredPlugin}
                        >
                            <DataTable.Data>
                                <IdPopup selected={item.id === hoveredPlugin} id={item.id} />
                            </DataTable.Data>
                            <DataTable.Data>
                                <PluginIcon src={item.icon} />
                            </DataTable.Data>
                            <DataTable.Data verticalAlign="flexMiddle">
                                {item.title || item.package_name}
                                <ResourceVisibility
                                    visibility={item.visibility}
                                    onSetVisibility={visibility => setPluginVisibility(item.id, visibility)}
                                    allowedSettingTo={allowedVisibilitySettings}
                                    className="rightFloated"
                                />
                            </DataTable.Data>
                            <DataTable.Data>{item.package_name}</DataTable.Data>
                            <DataTable.Data>{item.package_version}</DataTable.Data>
                            <DataTable.Data>{item.supported_platform}</DataTable.Data>
                            <DataTable.Data>{item.distribution}</DataTable.Data>
                            <DataTable.Data>{item.distribution_release}</DataTable.Data>
                            <DataTable.Data>{item.uploaded_at}</DataTable.Data>
                            <DataTable.Data>{item.created_by}</DataTable.Data>
                            <DataTable.Data textAlign="center" className="rowActions">
                                <Icon
                                    name="download"
                                    link
                                    title={translate('download')}
                                    onClick={(event: Event) => downloadPlugin(item, event)}
                                    style={{ marginBottom: 4 }}
                                />
                                <Icon
                                    name="trash"
                                    link
                                    title={translate('delete')}
                                    onClick={(event: Event) => deletePluginConfirm(item, event)}
                                />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}

                <DataTable.Action>
                    <Dropdown button text={translate('upload.button')}>
                        <Menu direction="left">
                            <Item text={translate('upload.marketplace')} onClick={showMarketplaceUploadModal} />
                            <Item text={translate('upload.package')} onClick={showPackageUploadModal} />
                        </Menu>
                    </Dropdown>
                </DataTable.Action>
            </DataTable>

            <UploadModal open={packageUploadModalShown} toolbox={toolbox} onHide={hidePackageUploadModal} />

            <MarketplaceModal open={marketplaceUploadModalShown} onHide={hideMarketplaceUploadModal} />

            <DeleteConfirm
                resourceName={translate('deleteLabel', {
                    name: selectedPlugin?.package_name ?? '',
                    version: selectedPlugin?.package_version ?? ''
                })}
                force={force}
                open={confirmDeleteShown}
                onConfirm={deletePlugin}
                onCancel={hideConfirmDelete}
                onForceChange={setForce}
            />
        </div>
    );
};

export default PluginsTable;
