import type { TokensWidget } from './types';

const {
    Basic: { DataTable },
    Utils: {
        Time: { formatTimestamp }
    }
} = Stage;

export const dataSortingKeys: Record<string, TokensWidget.DataSortingKeys> = {
    value: 'secret_hash',
    description: 'description',
    expirationDate: 'expiration_date',
    lastUsed: 'last_used'
} as const;

interface TokensTableProps {
    data: TokensWidget.Data;
    toolbox: Stage.Types.Toolbox;
    widgetConfiguration: TokensWidget.Configuration;
}

const TokensTable = ({ data, toolbox, widgetConfiguration }: TokensTableProps) => {
    const { showExpiredTokens } = widgetConfiguration;
    const fetchTableData = (fetchParams: any) => {
        toolbox.refresh(fetchParams);
    };

    return (
        <>
            <DataTable fetchData={fetchTableData}>
                <DataTable.Column label="Token" name={dataSortingKeys.value} />
                <DataTable.Column label="Description" name={dataSortingKeys.description} />
                <DataTable.Column label="Username" />
                {showExpiredTokens && (
                    <DataTable.Column label="Expiration date" name={dataSortingKeys.expirationDate} />
                )}
                <DataTable.Column label="Last used" name={dataSortingKeys.lastUsed} />
                <DataTable.Column label="" />
                {data?.items?.map(dataItem => {
                    return (
                        <DataTable.Row key={dataItem.id}>
                            <DataTable.Data>{dataItem.value}</DataTable.Data>
                            <DataTable.Data>{dataItem.description}</DataTable.Data>
                            <DataTable.Data>{dataItem.username}</DataTable.Data>
                            {showExpiredTokens && (
                                <DataTable.Data>{formatTimestamp(dataItem.expiration_date)}</DataTable.Data>
                            )}
                            <DataTable.Data>{formatTimestamp(dataItem.last_used)}</DataTable.Data>
                            <DataTable.Data>Remove button</DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </>
    );
};

export default TokensTable;
