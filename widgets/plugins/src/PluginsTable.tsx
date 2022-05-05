import type { FunctionComponent } from 'react';
import { useState } from 'react';
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
            setError(t('deleteError'));
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
    const { IdPopup, VerticallyAlignedCell } = Stage.Shared;
    const { DeleteConfirm } = Stage.Common.Components;
    const { UploadModal, Icon: PluginIcon } = Stage.Common.Plugins;
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
                noDataMessage={t('noData')}
            >
                <DataTable.Column name="id" />
                <DataTable.Column />
                <DataTable.Column label={t('columns.plugin')} name="title" width="20%" />
                <DataTable.Column label={t('columns.packageName')} name="package_name" width="20%" />
                <DataTable.Column label={t('columns.packageVersion')} name="package_version" width="10%" />
                <DataTable.Column label={t('columns.supportedPlatform')} name="supported_platform" width="10%" />
                <DataTable.Column label={t('columns.distribution')} name="distribution" width="10%" />
                <DataTable.Column label={t('columns.distributionRelease')} name="distribution_release" width="10%" />
                <DataTable.Column label={t('columns.uploadedAt')} name="uploaded_at" width="15%" />
                <DataTable.Column label={t('columns.creator')} name="created_by" width="15%" />
                <DataTable.Column width="10%" />

                {data.items.map(item => {
                    return (
                        <DataTable.Row
                            key={item.id}
                            selected={item.isSelected}
                            onClick={() => selectPlugin(item)}
                            onMouseOver={setHoveredPlugin}
                            onMouseOut={clearHoveredPlugin}
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
                                        onSetVisibility={visibility => setPluginVisibility(item.id, visibility)}
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
                                    title={t('download')}
                                    onClick={(event: Event) => downloadPlugin(item, event)}
                                />
                                <Icon
                                    name="trash"
                                    link
                                    bordered
                                    title={t('delete')}
                                    onClick={(event: Event) => deletePluginConfirm(item, event)}
                                />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}

                <DataTable.Action>
                    <Dropdown button text={t('upload.button')}>
                        <Menu direction="left">
                            <Item text={t('upload.marketplace')} onClick={showMarketplaceUploadModal} />
                            <Item text={t('upload.package')} onClick={showPackageUploadModal} />
                        </Menu>
                    </Dropdown>
                </DataTable.Action>
            </DataTable>

            <UploadModal open={packageUploadModalShown} toolbox={toolbox} onHide={hidePackageUploadModal} />

            <MarketplaceModal open={marketplaceUploadModalShown} onHide={hideMarketplaceUploadModal} />

            <DeleteConfirm
                resourceName={t('deleteLabel', {
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
