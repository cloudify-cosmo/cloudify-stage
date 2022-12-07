import { useEffect } from 'react';
import { dataSortingKeys, tableRefreshEvent } from './SecretProvidersTable.consts';
import type { SecretProvidersWidget } from './widget.types';

const { DataTable, Icon, Button } = Stage.Basic;
const { Time } = Stage.Utils;
const t = Stage.Utils.getT(`widgets.secretProviders.table`);

interface SecretProvidersTableProps {
    configuration: SecretProvidersWidget.Configuration;
    data: SecretProvidersWidget.Data;
    toolbox: Stage.Types.Toolbox;
}

const SecretProvidersTable = ({ configuration, data, toolbox }: SecretProvidersTableProps) => {
    const { pageSize, sortColumn, sortAscending } = configuration;
    const totalSize = data.metadata.pagination.total;

    const fetchTableData = (fetchParams: { gridParams: Stage.Types.GridParams }) => {
        toolbox.refresh(fetchParams);
    };

    useEffect(() => {
        toolbox.getEventBus().on(tableRefreshEvent, fetchTableData);
        return () => toolbox.getEventBus().off(tableRefreshEvent, fetchTableData);
    }, []);

    return (
        <>
            <DataTable
                fetchData={fetchTableData}
                noDataMessage={t('noSecretProviders')}
                totalSize={totalSize}
                pageSize={pageSize}
                sortColumn={sortColumn}
                sortAscending={sortAscending}
            >
                <DataTable.Action>
                    <Button labelPosition="left" icon="add" content={t('buttons.create')} />
                </DataTable.Action>

                <DataTable.Column label={t('columns.name')} name={dataSortingKeys.name} />
                <DataTable.Column label={t('columns.type')} name={dataSortingKeys.type} />
                <DataTable.Column label={t('columns.dateCreated')} name={dataSortingKeys.createdAt} width="156px" />
                <DataTable.Column label={t('columns.dateUpdated')} name={dataSortingKeys.updatedAt} width="156px" />
                <DataTable.Column label="" width="10%" />

                {data.items.map(secretProvider => (
                    <DataTable.Row key={secretProvider.id}>
                        <DataTable.Data>{secretProvider.name}</DataTable.Data>
                        <DataTable.Data>{secretProvider.type}</DataTable.Data>

                        <DataTable.Data>{Time.formatTimestamp(secretProvider.created_at)}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(secretProvider.updated_at)}</DataTable.Data>
                        <DataTable.Data>
                            <Icon name="edit" title={t('buttons.removeSecretProvider')} />
                            <Icon name="trash" title={t('buttons.updateSecretProvider')} />
                        </DataTable.Data>
                    </DataTable.Row>
                ))}
            </DataTable>
        </>
    );
};

export default SecretProvidersTable;
