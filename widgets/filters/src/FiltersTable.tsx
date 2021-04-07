import { isEmpty } from 'lodash';

import type { FunctionComponent } from 'react';
import type { Filter, FilterWidget, FilterUsage } from './types';
import FilterActions from './FilterActions';

interface FiltersTableData {
    filters: Filter[];
    total: number;
}

interface FiltersTableProps {
    data: FiltersTableData;
    toolbox: Stage.Types.Toolbox;
    widget: FilterWidget;
}

const FixedLayoutDataTable = Stage.styled(Stage.Basic.DataTable)`
    table-layout: fixed;
`;

const FiltersTable: FunctionComponent<FiltersTableProps> = ({ data, toolbox, widget }) => {
    const { i18n } = Stage;
    const { Alert, Confirm, DataTable, Icon, List } = Stage.Basic;
    const { Time } = Stage.Utils;
    const { useResettableState, useRefreshEvent } = Stage.Hooks;

    const [filterIdToDelete, setFilterIdToDelete, clearFilterIdToDelete] = useResettableState('');
    const [filterUsage, setFilterUsage, clearFilterUsage] = useResettableState<FilterUsage[]>([]);

    useRefreshEvent(toolbox, 'filters:refresh');

    return (
        <>
            <FixedLayoutDataTable
                noDataMessage={i18n.t('widgets.filters.noFilters')}
                fetchData={toolbox.refresh}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                searchable
                sortable
            >
                <DataTable.Column width="33%" label={i18n.t('widgets.filters.columns.name')} name="id" />
                <DataTable.Column width="33%" label={i18n.t('widgets.filters.columns.creator')} name="created_by" />
                <DataTable.Column width="33%" label={i18n.t('widgets.filters.columns.created')} name="created_at" />
                <DataTable.Column width="112px" />
                {data.filters.map(filter => (
                    <DataTable.Row key={filter.id}>
                        <DataTable.Data>{filter.id}</DataTable.Data>
                        <DataTable.Data>{filter.created_by}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(filter.created_at)}</DataTable.Data>
                        <DataTable.Data>
                            <Icon
                                name="edit"
                                disabled
                                bordered
                                title={i18n.t('widgets.filters.columns.actions.edit')}
                            />
                            <Icon
                                name="clone"
                                disabled
                                bordered
                                title={i18n.t('widgets.filters.columns.actions.clone')}
                            />
                            <Icon
                                name="trash"
                                link
                                bordered
                                title={i18n.t('widgets.filters.columns.actions.delete')}
                                onClick={() => setFilterIdToDelete(filter.id)}
                            />
                        </DataTable.Data>
                    </DataTable.Row>
                ))}
            </FixedLayoutDataTable>

            <Confirm
                open={!!filterIdToDelete}
                onCancel={clearFilterIdToDelete}
                onConfirm={() => {
                    const filterActions = new FilterActions(toolbox);
                    filterActions.doGetFilterUsage(filterIdToDelete).then(resolvedFilterUsage => {
                        if (isEmpty(resolvedFilterUsage)) {
                            clearFilterIdToDelete();
                            toolbox.loading(true);
                            filterActions.doDelete(filterIdToDelete).then(toolbox.refresh);
                        } else {
                            setFilterUsage(resolvedFilterUsage);
                        }
                    });
                }}
                content={i18n.t('widgets.filters.deleteConfirm', { filterId: filterIdToDelete })}
            />

            <Alert
                open={!isEmpty(filterUsage)}
                onDismiss={() => {
                    clearFilterUsage();
                    clearFilterIdToDelete();
                }}
                content={
                    <span style={{ lineHeight: '3em', fontSize: '0.9em' }}>
                        {i18n.t('widgets.filters.filterInUse.heading', { filterId: filterIdToDelete })}
                        <List bulleted>
                            {filterUsage.map(usageInfo => (
                                <List.Item>{i18n.t('widgets.filters.filterInUse.usageInfo', usageInfo)}</List.Item>
                            ))}
                        </List>
                    </span>
                }
            />
        </>
    );
};

export default FiltersTable;
