import _ from 'lodash';

import { FunctionComponent } from 'react';
import type { Filter, FilterWidget } from './types';
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

const FiltersTable: FunctionComponent<FiltersTableProps> = ({ data, toolbox, widget }) => {
    const { i18n } = Stage;
    const { Confirm, DataTable, Icon } = Stage.Basic;
    const { Time } = Stage.Utils;
    const { useResettableState, useRefreshEvent } = Stage.Hooks;

    const [filterIdToDelete, setFilterIdToDelete, clearFilterIdToDelete] = useResettableState('');

    useRefreshEvent(toolbox, 'filters:refresh');

    return (
        <>
            <DataTable
                className="filtersTable"
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
            </DataTable>

            <Confirm
                open={!!filterIdToDelete}
                onCancel={clearFilterIdToDelete}
                onConfirm={() => {
                    clearFilterIdToDelete();
                    toolbox.loading(true);
                    new FilterActions(toolbox).doDelete(filterIdToDelete).then(toolbox.refresh);
                }}
                content={i18n.t('widgets.filters.deleteConfirm', { filterId: filterIdToDelete })}
            />
        </>
    );
};

export default FiltersTable;
