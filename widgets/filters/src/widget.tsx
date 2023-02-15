import type { ComponentProps } from 'react';
import FiltersTable from './FiltersTable';
import type { FilterWidgetConfiguration } from './types';
import type { Filter } from '../../../app/widgets/common/filters/types';

Stage.defineWidget<Filter, Stage.Types.PaginatedResponse<Filter>, FilterWidgetConfiguration>({
    id: 'filters',
    initialWidth: 12,
    initialHeight: 22,
    hasStyle: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filters'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('id'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData(_widget, toolbox, params) {
        if (toolbox.getContext().getValue('onlyMyResources')) {
            params.created_by = toolbox.getManager().getCurrentUsername();
        }
        return new Stage.Common.Filters.Actions(toolbox).doList(params);
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
