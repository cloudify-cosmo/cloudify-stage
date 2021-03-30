import { ComponentProps } from 'react';
import FilterActions from './FilterActions';
import FiltersTable from './FiltersTable';
import type { Filter, FilterWidgetConfiguration } from './types';

Stage.defineWidget<unknown, Stage.Types.PaginatedResponse<Filter>, FilterWidgetConfiguration>({
    id: 'filters',
    name: Stage.i18n.t('widgets.filters.name'),
    description: Stage.i18n.t('widgets.filters.description'),
    initialWidth: 12,
    initialHeight: 22,
    color: 'olive',
    isReact: true,
    hasStyle: true,
    hasReadme: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filters'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('id'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData(_widget, toolbox, params) {
        return new FilterActions(toolbox).doList(params);
    },

    render(widget, data, _error, toolbox) {
        if (Stage.Utils.isEmptyWidgetData(data)) {
            const { Loading } = Stage.Basic;
            return <Loading />;
        }

        const formattedData: ComponentProps<typeof FiltersTable>['data'] = {
            filters: data.items,
            total: data.metadata.pagination.total
        };

        return <FiltersTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
