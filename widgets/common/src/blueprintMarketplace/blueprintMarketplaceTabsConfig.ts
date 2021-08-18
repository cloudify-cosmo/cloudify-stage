const t = Stage.Utils.getT(`widgets.blueprints.configuration.marketplaceTabs`);

export const blueprintMarketplaceTabsConfig: Stage.Types.WidgetConfigurationDefinition = {
    id: 'marketplaceTabs',
    name: t('name'),
    columns: [
        {
            id: 'name',
            label: t('columns.tabNameLabel'),
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'url',
            label: t('columns.urlNameLabel'),
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        }
    ],
    default: [
        {
            name: t('columns.defaultValues.0.name'),
            url: t('columns.defaultValues.0.url')
        },
        {
            name: t('columns.defaultValues.1.name'),
            url: t('columns.defaultValues.1.url')
        },
        {
            name: t('columns.defaultValues.2.name'),
            url: t('columns.defaultValues.2.url')
        }
    ],
    type: Stage.Basic.GenericField.CUSTOM_TYPE,
    component: Stage.Shared.DynamicTable
};

export default blueprintMarketplaceTabsConfig;
