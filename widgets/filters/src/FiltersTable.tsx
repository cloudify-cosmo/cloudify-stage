import { isEmpty } from 'lodash';

import type { FunctionComponent } from 'react';
import type { Filter, FilterWidget, FilterUsage } from './types';
import FilterActions from './FilterActions';
import FilterAddModal from './FilterAddModal';
import FilterCloneModal from './FilterCloneModal';
import FilterEditModal from './FilterEditModal';
import type { FilterRule } from '../../common/src/filters/types';

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
    const { Alert, Button, Confirm, DataTable, Icon, List } = Stage.Basic;
    const { Time } = Stage.Utils;
    const { useResettableState, useRefreshEvent, useBoolean } = Stage.Hooks;

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
                                link
                                bordered
                                title={i18n.t('widgets.filters.columns.actions.edit')}
                                onClick={() => setFilterToEdit(filter)}
                            />
                            <Icon
                                name="clone"
                                link
                                bordered
                                title={i18n.t('widgets.filters.columns.actions.clone')}
                                onClick={() => setFilterToClone(filter)}
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
