import _ from 'lodash';

import { FunctionComponent } from 'react';
import type { Filter, Widget } from './types';

interface FiltersTableData {
    filters: Filter[];
    total: number;
}

interface FiltersTableProps {
    data: FiltersTableData;
    toolbox: Stage.Types.Toolbox;
    widget: Widget;
}

const FiltersTable: FunctionComponent<FiltersTableProps> = ({ data, toolbox, widget }) => {
    const { i18n } = Stage;
    const { DataTable } = Stage.Basic;
    const { Time } = Stage.Utils;

    return (
        <>
            <DataTable
                noDataMessage={i18n.t('widgets.filters.noFilters')}
                fetchData={toolbox.refresh}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                searchable
                sortable
            >
                <DataTable.Column width="1%" label={i18n.t('widgets.filters.columns.name')} name="id" />
                <DataTable.Column width="1%" label={i18n.t('widgets.filters.columns.creator')} name="created_by" />
                <DataTable.Column width="1%" label={i18n.t('widgets.filters.columns.created')} name="created_at" />
                {data.filters.map(filter => (
                    <DataTable.Row key={filter.id}>
                        <DataTable.Data>{filter.id}</DataTable.Data>
                        <DataTable.Data>{filter.created_by}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(filter.created_at)}</DataTable.Data>
                    </DataTable.Row>
                ))}
            </DataTable>
        </>
    );
};

export default FiltersTable;
