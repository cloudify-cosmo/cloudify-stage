import type { TokensWidget } from './types';
import TextEllipsis from './TextEllipsis';

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
    const shouldDisplayUsers = ReactRedux.useSelector(
        (state: Stage.Types.ReduxState) => state.manager.auth.role === Stage.Common.Consts.sysAdminRole
    );
    const fetchTableData = (fetchParams: any) => {
        toolbox.refresh(fetchParams);
    };

    return (
        <>
            <DataTable fetchData={fetchTableData}>
                <DataTable.Column label="Token" name={dataSortingKeys.value} width="20%" />
                <DataTable.Column label="Description" name={dataSortingKeys.description} />
                {shouldDisplayUsers && <DataTable.Column label="Username" />}
                {showExpiredTokens && (
                    <DataTable.Column label="Expiration date" name={dataSortingKeys.expirationDate} />
                )}
                <DataTable.Column label="Last used" name={dataSortingKeys.lastUsed} />
                <DataTable.Column label="" />
                {data?.items?.map(dataItem => {
                    return (
                        <DataTable.Row key={dataItem.id}>
                            <DataTable.Data>
                                <TextEllipsis content={dataItem.value} />
                            </DataTable.Data>
                            <DataTable.Data>
                                <TextEllipsis content={dataItem.description} />
                            </DataTable.Data>
                            {shouldDisplayUsers && (
                                <DataTable.Data>
                                    <TextEllipsis content={dataItem.username} />
                                </DataTable.Data>
                            )}
                            {showExpiredTokens && (
                                <DataTable.Data>
                                    <TextEllipsis content={formatTimestamp(dataItem.expiration_date)} />
                                </DataTable.Data>
                            )}
                            <DataTable.Data>
                                <TextEllipsis content={formatTimestamp(dataItem.last_used)} />
                            </DataTable.Data>
                            <DataTable.Data>Remove button</DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </>
    );
};

export default TokensTable;
