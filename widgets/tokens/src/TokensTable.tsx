import { useEffect } from 'react';
import type { TokensWidget } from './widget.types';
import TokensTableHeader from './TokensTableHeader';
import RemoveTokenButton from './RemoveTokenButton';
import { tableRefreshEvent, dataSortingKeys } from './TokensTable.consts';
import { translationPath } from './widget.consts';

const { DataTable } = Stage.Basic;
const { TextEllipsis } = Stage.Shared;

const { Time, getT } = Stage.Utils;

const t = getT(`${translationPath}.table`);

interface TokensTableProps {
    data: TokensWidget.Data;
    toolbox: Stage.Types.Toolbox;
}

const TokensTable = ({ data, toolbox }: TokensTableProps) => {
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
                <DataTable.Column
                    label={t('columns.expirationDate')}
                    name={dataSortingKeys.expirationDate}
                    width="156px"
                />
                <DataTable.Column label={t('columns.lastUsed')} name={dataSortingKeys.lastUsed} width="156px" />
                <DataTable.Column label="" width="48px" />
                {data?.items?.map(dataItem => (
                    <DataTable.Row key={dataItem.id}>
                        <DataTable.Data>
                            <TextEllipsis maxWidth="300px">{dataItem.value}</TextEllipsis>
                        </DataTable.Data>
                        <DataTable.Data>
                            <TextEllipsis maxWidth="300px">{dataItem.description ?? ''}</TextEllipsis>
                        </DataTable.Data>
                        {shouldDisplayUsers && (
                            <DataTable.Data>
                                <TextEllipsis maxWidth="100px">{dataItem.username}</TextEllipsis>
                            </DataTable.Data>
                        )}
                        <DataTable.Data>{Time.formatTimestamp(dataItem.expiration_date)}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(dataItem.last_used)}</DataTable.Data>
                        <DataTable.Data>
                            <RemoveTokenButton token={dataItem} toolbox={toolbox} />
                        </DataTable.Data>
                    </DataTable.Row>
                ))}
            </DataTable>
        </>
    );
};

export default TokensTable;
