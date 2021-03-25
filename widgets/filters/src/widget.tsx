import FilterActions from './FilterActions';
import FiltersTable from './FiltersTable';
import type { Filter, WidgetConfiguration } from './types';

Stage.defineWidget<unknown, Stage.Types.PaginatedResponse<Filter>, WidgetConfiguration>({
    id: 'filters',
    name: Stage.i18n.t('widgets.filters.name'),
    description: Stage.i18n.t('widgets.filters.description'),
    initialWidth: 12,
    initialHeight: 28,
    color: 'olive',
    isReact: true,
    hasStyle: false,
    hasReadme: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filters'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30), Stage.GenericConfig.PAGE_SIZE_CONFIG(10)],

    fetchData(_widget, toolbox, params) {
        return new FilterActions(toolbox).doList(params);
    },

    render(widget, data, _error, toolbox) {
        if (!data?.items) {
            const { Loading } = Stage.Basic;
            return <Loading />;
        }

        const formattedData = {
            filters: data.items,
            total: data.metadata.pagination.total
        };

        return <FiltersTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
