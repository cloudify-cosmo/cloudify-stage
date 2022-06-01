import { times } from 'lodash';

const t = Stage.Utils.getT(`widgets.blueprints.configuration.marketplaceTabs`);
const defaultNumberOfTabs = 13;

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
    default: times(defaultNumberOfTabs, num => ({
        name: t(`columns.defaultValues.${num}.name`),
        url: t(`columns.defaultValues.${num}.url`)
    })),
    type: Stage.Basic.GenericField.CUSTOM_TYPE,
    component: Stage.Shared.DynamicTable
};

export default blueprintMarketplaceTabsConfig;
