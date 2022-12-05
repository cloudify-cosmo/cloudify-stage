import { useEffect } from 'react';
import SecretProvidersTableHeader from './SecretProvidersTableHeader';
import { dataSortingKeys, tableRefreshEvent } from './SecretProvidersTable.consts';
import type { SecretProvidersWidget } from './widget.types';

const { DataTable, Icon } = Stage.Basic;
const { Time } = Stage.Utils;
const t = Stage.Utils.getT(`widgets.secretProviders.table`);

interface SecretProvidersTableProps {
    configuration: SecretProvidersWidget.Configuration;
    data: SecretProvidersWidget.Data;
    toolbox: Stage.Types.Toolbox;
}

const SecretProvidersTable = ({ configuration, data, toolbox }: SecretProvidersTableProps) => {
    const { pageSize, sortColumn, sortAscending } = configuration;
    const totalSize = data?.metadata?.pagination?.total;

    const fetchTableData = (fetchParams: any) => {
        toolbox.refresh(fetchParams);
    };

    useEffect(() => {
        toolbox.getEventBus().on(tableRefreshEvent, fetchTableData);
        return () => toolbox.getEventBus().off(tableRefreshEvent, fetchTableData);
    }, []);

    return (
        <>
            <SecretProvidersTableHeader />
            <DataTable
                fetchData={fetchTableData}
                noDataMessage={t('noSecretProviders')}
                totalSize={totalSize}
                pageSize={pageSize}
                sortColumn={sortColumn}
                sortAscending={sortAscending}
            >
                <DataTable.Column label={t('columns.name')} name={dataSortingKeys.value} />
                <DataTable.Column label={t('columns.type')} name={dataSortingKeys.description} />
                <DataTable.Column label={t('columns.dateCreated')} name={dataSortingKeys.createdAt} width="156px" />
                <DataTable.Column label={t('columns.dateUpdated')} name={dataSortingKeys.updatedAt} width="156px" />
                <DataTable.Column label="" width="10%" />

                {data?.items?.map(dataItem => (
                    <DataTable.Row key={dataItem.id}>
                        <DataTable.Data>{dataItem.name}</DataTable.Data>
                        <DataTable.Data>{dataItem.type}</DataTable.Data>

                        <DataTable.Data>{Time.formatTimestamp(dataItem.created_at)}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(dataItem.updated_at)}</DataTable.Data>
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
