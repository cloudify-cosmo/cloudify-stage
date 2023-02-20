import { isEmpty } from 'lodash';

import type { FunctionComponent } from 'react';
import type { FilterWidget } from './types';
import FilterAddModal from './FilterAddModal';
import FilterCloneModal from './FilterCloneModal';
import FilterEditModal from './FilterEditModal';
import type { Filter, FilterUsage, FilterRule } from '../../../app/widgets/common/filters/types';

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

function tColumn(columnKey: string) {
    return Stage.i18n.t(`widgets.filters.columns.${columnKey}`);
}

const FiltersTable: FunctionComponent<FiltersTableProps> = ({ data, toolbox, widget }) => {
    const { i18n } = Stage;
    const { Alert, Button, Checkbox, Confirm, DataTable, Icon, List } = Stage.Basic;
    const { Time } = Stage.Utils;
    const { useResettableState, useRefreshEvent, useBoolean } = Stage.Hooks;
    const { Actions: FilterActions } = Stage.Common.Filters;

    const [filterIdToDelete, setFilterIdToDelete, clearFilterIdToDelete] = useResettableState('');
    const [filterUsage, setFilterUsage, clearFilterUsage] = useResettableState<FilterUsage[]>([]);

    const [addModalOpen, openAddModal, closeAddModal] = useBoolean();
    const [filterToClone, setFilterToClone, unsetFilterToClone] = useResettableState<Filter | undefined>(undefined);
    const [filterToEdit, setFilterToEdit, unsetFilterToEdit] = useResettableState<Filter | undefined>(undefined);

    useRefreshEvent(toolbox, 'filters:refresh');

    function handleAddFilter(filterId: string, filterRules: FilterRule[]) {
        return new FilterActions(toolbox).doCreate(filterId, filterRules).then(closeAddModal).then(unsetFilterToClone);
    }

    function handleEditFilter(filterId: string, filterRules: FilterRule[]) {
        return new FilterActions(toolbox).doUpdate(filterId, filterRules).then(unsetFilterToEdit);
    }

    return (
        <>
            <FixedLayoutDataTable
                noDataMessage={i18n.t('widgets.filters.noFilters')}
                fetchData={toolbox.refresh}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                searchable
            >
                <DataTable.Column width="60%" label={tColumn('name')} name="id" />
                <DataTable.Column width="40%" label={tColumn('creator')} name="created_by" />
                <DataTable.Column width="134px" label={tColumn('created')} name="created_at" />
                <DataTable.Column width="64px" label={tColumn('system')} name="is_system_filter" />
                <DataTable.Column width="80px" />
                {data.filters.map(filter => (
                    <DataTable.Row key={filter.id}>
                        <DataTable.Data style={{ wordBreak: 'break-word' }}>{filter.id}</DataTable.Data>
                        <DataTable.Data>{filter.created_by}</DataTable.Data>
                        <DataTable.Data>{Time.formatTimestamp(filter.created_at)}</DataTable.Data>
                        <DataTable.Data>
                            <Checkbox checked={filter.is_system_filter} disabled />
                        </DataTable.Data>
                        <DataTable.Data>
                            <Icon
                                name="clone"
                                link
                                title={tColumn('actions.clone')}
                                onClick={() => setFilterToClone(filter)}
                            />
                            <Icon
                                name="edit"
                                link={!filter.is_system_filter}
                                disabled={filter.is_system_filter}
                                title={tColumn(`actions.${filter.is_system_filter ? 'systemFilter' : 'edit'}`)}
                                onClick={() => setFilterToEdit(filter)}
                            />
                            <Icon
                                name="trash"
                                link={!filter.is_system_filter}
                                disabled={filter.is_system_filter}
                                title={tColumn(`actions.${filter.is_system_filter ? 'systemFilter' : 'delete'}`)}
                                onClick={() => setFilterIdToDelete(filter.id)}
                            />
                        </DataTable.Data>
                    </DataTable.Row>
                ))}

                <DataTable.Action>
                    <Button
                        content={i18n.t('widgets.filters.add')}
                        icon="add"
                        labelPosition="left"
                        onClick={openAddModal}
                    />
                </DataTable.Action>
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
                                <List.Item key={JSON.stringify(usageInfo)}>
                                    {i18n.t('widgets.filters.filterInUse.usageInfo', usageInfo)}
                                </List.Item>
                            ))}
                        </List>
                    </span>
                }
            />

            {addModalOpen && <FilterAddModal onSubmit={handleAddFilter} onCancel={closeAddModal} toolbox={toolbox} />}

            {filterToClone && (
                <FilterCloneModal
                    initialFilter={filterToClone}
                    onSubmit={handleAddFilter}
                    onCancel={unsetFilterToClone}
                    toolbox={toolbox}
                />
            )}

            {filterToEdit && (
                <FilterEditModal
                    initialFilter={filterToEdit}
                    onSubmit={handleEditFilter}
                    onCancel={unsetFilterToEdit}
                    toolbox={toolbox}
                />
            )}
        </>
    );
};

export default FiltersTable;
