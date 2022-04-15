import { useEffect } from 'react';
import type { TokensWidget } from './widget.types';
import TextEllipsis from './TextEllipsis';
import TokensTableHeader from './TokensTableHeader';
import RemoveTokenButton from './RemoveTokenButton';
import { tableRefreshEvent, dataSortingKeys } from './TokensTable.consts';
import { translationPath } from './widget.consts';

const { DataTable } = Stage.Basic;
const { Time, getT } = Stage.Utils;

const t = getT(`${translationPath}.table`);

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

    useEffect(() => {
        toolbox.getEventBus().on(tableRefreshEvent, fetchTableData);
        return () => toolbox.getEventBus().off(tableRefreshEvent, fetchTableData);
    }, []);

    return (
        <>
            <TokensTableHeader toolbox={toolbox} />
            <DataTable fetchData={fetchTableData} noDataMessage={t('noTokens')}>
                <DataTable.Column label={t('columns.token')} name={dataSortingKeys.value} />
                <DataTable.Column label={t('columns.description')} name={dataSortingKeys.description} />
                {shouldDisplayUsers && <DataTable.Column label={t('columns.username')} />}
                {showExpiredTokens && (
                    <DataTable.Column label={t('columns.expirationDate')} name={dataSortingKeys.expirationDate} />
                )}
                <DataTable.Column label={t('columns.lastUsed')} name={dataSortingKeys.lastUsed} />
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
                                    <TextEllipsis content={Time.formatTimestamp(dataItem.expiration_date)} />
                                </DataTable.Data>
                            )}
                            <DataTable.Data>
                                <TextEllipsis content={Time.formatTimestamp(dataItem.last_used)} />
                            </DataTable.Data>
                            <DataTable.Data>
                                <RemoveTokenButton tokenId={dataItem.id} toolbox={toolbox} />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </>
    );
};

export default TokensTable;
