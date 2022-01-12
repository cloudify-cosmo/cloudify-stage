// @ts-nocheck File not migrated fully to TS

import TenantsTable from './TenantsTable';

const widgetId = 'tenants';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 5,
    initialHeight: 16,
    color: 'green',
    fetchUrl: '[manager]/tenants?_get_data=true[params]',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const selectedTenant = toolbox.getContext().getValue('tenantName');

        let formattedData = data;
        formattedData = {
            ...formattedData,
            items: _.map(formattedData.items, item => {
                return { ...item, groups: item.groups, users: item.users, isSelected: item.name === selectedTenant };
            }),
            total: _.get(data, 'metadata.pagination.total', 0)
        };

        return <TenantsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
