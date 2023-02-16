import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { PaginatedResponse } from 'backend/types';
import type { Tenant } from './widget.types';
import TenantsTable from './TenantsTable';

const widgetId = 'tenants';

Stage.defineWidget<never, PaginatedResponse<Tenant>, DataTableConfiguration>({
    id: widgetId,
    initialWidth: 5,
    initialHeight: 16,
    fetchUrl: '[manager]/tenants?_get_data=true[params]',
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const formattedData = {
            items: data!.items,
            total: _.get(data, 'metadata.pagination.total', 0)
        };

        return <TenantsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
