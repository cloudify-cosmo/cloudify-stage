import i18n from 'i18next';
import { i18nPrefix } from './common';
import type { DeploymentsViewColumnId } from './table';
import { deploymentsViewColumnIds, getDeploymentsViewColumnDefinitions } from './table';
import DeploymentLabelConfigurationInput from './DeploymentLabelConfigurationInput';
import GenericConfig from '../../../utils/GenericConfig';
import { GenericField } from '../../../components/basic';

export interface SharedDeploymentsViewWidgetConfiguration {
    /** In seconds */
    customPollingTime: number;
    mapHeight: number;
    fieldsToShow: DeploymentsViewColumnId[];
    keysOfLabelsToShow: string[];
    pageSize: number;
    sortColumn: string;
    sortAscending: boolean;
}

const tConfiguration = (suffix: string) => i18n.t(`${i18nPrefix}.configuration.${suffix}`);

const defaultMapHeight = 300;

export function getSharedConfiguration(): Stage.Types.WidgetConfigurationDefinition[] {
    return [
        {
            ...GenericConfig.POLLING_TIME_CONFIG(10),
            // NOTE: polling is handled by react-query, thus, use a different ID
            id: 'customPollingTime'
        },
        {
            id: 'mapHeight',
            type: GenericField.NUMBER_TYPE,
            name: tConfiguration('mapHeight.name'),
            description: tConfiguration('mapHeight.description'),
            default: defaultMapHeight
        },
        {
            id: 'fieldsToShow',
            name: tConfiguration('fieldsToShow.name'),
            placeHolder: tConfiguration('fieldsToShow.placeholder'),
            items: deploymentsViewColumnIds.map(columnId => ({
                name: getDeploymentsViewColumnDefinitions()[columnId].name,
                value: columnId
            })),
            default: deploymentsViewColumnIds.filter(columnId => columnId !== 'environmentType'),
            type: GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'keysOfLabelsToShow',
            name: tConfiguration('keysOfLabelsToShow.name'),
            placeHolder: tConfiguration('fieldsToShow.placeholder'),
            default: [],
            type: GenericField.CUSTOM_TYPE,
            component: DeploymentLabelConfigurationInput
        },
        {
            ...GenericConfig.PAGE_SIZE_CONFIG(50),
            hidden: false,
            name: tConfiguration('pageSize.name'),
            min: 1
        },
        GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        GenericConfig.SORT_ASCENDING_CONFIG(false)
    ];
}

// NOTE: a constrained identity function for full type safety with less typing
const getSharedDefinition = <D extends Partial<Stage.Types.WidgetDefinition>>(d: D) => d;
export const sharedDefinition = getSharedDefinition({
    initialWidth: 12,
    initialHeight: 28,
    categories: [GenericConfig.CATEGORY.DEPLOYMENTS],

    hasReadme: true,
    hasStyle: false,
    permission: GenericConfig.WIDGET_PERMISSION('deploymentsView')
});
