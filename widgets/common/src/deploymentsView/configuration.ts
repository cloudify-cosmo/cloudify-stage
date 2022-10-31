import { i18nPrefix } from './common';
import type { DeploymentsViewColumnId } from './table';
import { deploymentsViewColumnDefinitions, deploymentsViewColumnIds } from './table';
import DeploymentLabelConfigurationInput from './DeploymentLabeLConfigurationInput';

export interface SharedDeploymentsViewWidgetConfiguration {
    /** In seconds */
    customPollingTime: number;
    mapHeight: number;
    fieldsToShow: DeploymentsViewColumnId[];
    labelsToShow: string[];
    pageSize: number;
    sortColumn: string;
    sortAscending: boolean;
}

const tConfiguration = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.configuration.${suffix}`);

const defaultMapHeight = 300;

export const sharedConfiguration: Stage.Types.WidgetConfigurationDefinition[] = [
    {
        ...Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        // NOTE: polling is handled by react-query, thus, use a different ID
        id: 'customPollingTime'
    },
    {
        id: 'mapHeight',
        type: Stage.Basic.GenericField.NUMBER_TYPE,
        name: tConfiguration('mapHeight.name'),
        description: tConfiguration('mapHeight.description'),
        default: defaultMapHeight
    },
    {
        id: 'fieldsToShow',
        name: tConfiguration('fieldsToShow.name'),
        placeHolder: tConfiguration('fieldsToShow.placeholder'),
        items: deploymentsViewColumnIds.map(columnId => ({
            name: deploymentsViewColumnDefinitions[columnId].name,
            value: columnId
        })),
        default: deploymentsViewColumnIds.filter(columnId => columnId !== 'environmentType'),
        type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
    },
    {
        id: 'labelsToShow',
        name: tConfiguration('labelsToShow.name') || 'aaa',
        placeHolder: tConfiguration('fieldsToShow.placeholder') || 'bbb',
        default: [],
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: DeploymentLabelConfigurationInput
    },
    {
        ...Stage.GenericConfig.PAGE_SIZE_CONFIG(50),
        hidden: false,
        name: tConfiguration('pageSize.name'),
        min: 1
    },
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
    hasReadme: true,
    hasStyle: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentsView')
});
