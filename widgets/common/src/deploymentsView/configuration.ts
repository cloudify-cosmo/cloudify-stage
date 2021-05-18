import { i18nPrefix } from './common';
import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId, deploymentsViewColumnIds } from './table';

export interface SharedDeploymentsViewWidgetConfiguration {
    /** In seconds */
    customPollingTime: number;
    mapOpenByDefault: boolean;
    mapHeight: number;
    fieldsToShow: DeploymentsViewColumnId[];
    pageSize: number;
    sortColumn: string;
    sortAscending: boolean;
}

const configurationT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.configuration.${suffix}`);

const defaultMapHeight = 300;

export const sharedConfiguration: Stage.Types.WidgetConfigurationDefinition[] = [
    {
        ...Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        // NOTE: polling is handled by react-query, thus, use a different ID
        id: 'customPollingTime'
    },
    {
        id: 'mapOpenByDefault',
        type: Stage.Basic.GenericField.BOOLEAN_TYPE,
        name: configurationT('mapOpenByDefault.name'),
        default: false
    },
    {
        id: 'mapHeight',
        type: Stage.Basic.GenericField.NUMBER_TYPE,
        name: configurationT('mapHeight.name'),
        description: configurationT('mapHeight.description'),
        default: defaultMapHeight
    },
    {
        id: 'fieldsToShow',
        name: configurationT('fieldsToShow.name'),
        placeHolder: configurationT('fieldsToShow.placeholder'),
        items: deploymentsViewColumnIds.map(columnId => ({
            name: deploymentsViewColumnDefinitions[columnId].name,
            value: columnId
        })),
        default: deploymentsViewColumnIds.filter(columnId => columnId !== 'environmentType'),
        type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
    },
    Stage.GenericConfig.PAGE_SIZE_CONFIG(50),
    Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
    Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
];

// NOTE: a constrained identity function for full type safety with less typing
const getSharedDefinition = <D extends Partial<Stage.Types.WidgetDefinition>>(d: D) => d;
export const sharedDefinition = getSharedDefinition({
    initialWidth: 12,
    initialHeight: 28,
    color: 'purple',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    isReact: true,
    // TODO(RD-1532): enable readme after filling it in
    hasReadme: false,
    hasStyle: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentsView')
});
