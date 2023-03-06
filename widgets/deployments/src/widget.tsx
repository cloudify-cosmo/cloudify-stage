import { get, isEmpty, isEqual } from 'lodash';
import type {
    PageSizeConfiguration,
    PollingTimeConfiguration,
    SortAscendingConfiguration,
    SortColumnConfiguration
} from 'app/utils/GenericConfig';
import './widget.css';
import type { DeploymentsData, FetchedLastExecutionType } from 'widgets/deployments/src/types';
import type { InstanceSummaryItem } from 'app/widgets/common/nodes/NodeInstancesConsts';
import DeploymentsList from './DeploymentsList';
import FirstUserJourneyButtons from './FirstUserJourneyButtons';
import type { DeploymentsListData } from './types';
import { fetchedDeploymentFields, fetchedLastExecutionFields } from './types';

const translate = Stage.Utils.getT('widgets.deployments');

export interface DeploymentsConfiguration
    extends PollingTimeConfiguration,
        PageSizeConfiguration,
        SortColumnConfiguration,
        SortAscendingConfiguration {
    blueprintIdFilter: string;
    showFirstUserJourneyButtons: boolean;
    clickToDrillDown: boolean;
    displayStyle: 'table' | 'list';
    showExecutionStatusLabel: boolean;
}

type DeploymentsParams = {
    _search?: string;
    /* eslint-disable camelcase */
    blueprint_id: string;
    site_name?: string;
    created_by?: string;
    /* eslint-enable camelcase */
};

Stage.defineWidget<DeploymentsParams, DeploymentsData, DeploymentsConfiguration>({
    id: 'deployments',
    initialWidth: 8,
    initialHeight: 24,
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'clickToDrillDown',
            name: translate('configuration.clickToDrillDown.name'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showExecutionStatusLabel',
            name: translate('configuration.showExecutionStatusLabel.name'),
            description: translate('configuration.showExecutionStatusLabel.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showFirstUserJourneyButtons',
            name: translate('configuration.showFirstUserJourneyButtons.name'),
            description: translate('configuration.showFirstUserJourneyButtons.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'blueprintIdFilter',
            name: translate('configuration.blueprintIdFilter.name'),
            placeHolder: 'Enter the blueprint id you wish to filter by',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'displayStyle',
            name: translate('configuration.displayStyle.name'),
            items: [
                { name: 'Table', value: 'table' },
                { name: 'List', value: 'list' }
            ],
            default: 'table',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchParams(widget, toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');
        blueprintId = isEmpty(widget.configuration.blueprintIdFilter)
            ? blueprintId
            : widget.configuration.blueprintIdFilter;
        const obj: DeploymentsParams = { blueprint_id: blueprintId };

        const siteName = toolbox.getContext().getValue('siteName');
        if (siteName) {
            obj.site_name = siteName;
        }

        if (toolbox.getContext().getValue('onlyMyResources')) {
            obj.created_by = toolbox.getManager().getCurrentUsername();
        }
        return obj;
    },

    async fetchData(_widget, toolbox, params) {
        const deploymentDataPromise = new Stage.Common.Deployments.Actions(toolbox.getManager()).doGetDeployments<
            typeof fetchedDeploymentFields[number]
        >(
            Stage.Common.Actions.Search.searchAlsoByDeploymentName({
                _include: fetchedDeploymentFields.join(','),
                ...params
            })
        );

        const nodeInstanceDataPromise = deploymentDataPromise
            .then(data => data.items.map(item => item.id))
            .then(ids =>
                new Stage.Common.Actions.Summary(toolbox).doGetNodeInstances<'deployment_id', string, 'state', string>(
                    'deployment_id',
                    {
                        _sub_field: 'state',
                        deployment_id: ids
                    }
                )
            );

        const latestExecutionsDataPromise = deploymentDataPromise
            .then(data => data.items.map(item => item.latest_execution))
            .then(ids =>
                new Stage.Common.Executions.Actions(toolbox.getManager()).doGetAll<
                    typeof fetchedLastExecutionFields[number]
                >({
                    _include: fetchedLastExecutionFields.join(','),
                    id: ids
                })
            );

        return Promise.all([deploymentDataPromise, nodeInstanceDataPromise, latestExecutionsDataPromise]).then(data => {
            const { NodeInstancesConsts } = Stage.Common;
            const deploymentData = data[0];

            const nodeInstanceData = data[1].items.reduce(
                (
                    result: Record<string, { states: Record<string, number>; count: number }>,
                    item: InstanceSummaryItem
                ) => {
                    result[item.deployment_id] = {
                        states: NodeInstancesConsts.extractStatesFrom(item),
                        count: item.node_instances
                    };
                    return result;
                },
                {}
            );
            const latestExecutionData = data[2].items.reduce(
                (result: Record<string, FetchedLastExecutionType>, latestExecution) => {
                    result[latestExecution.deployment_id] = latestExecution;
                    return result;
                },
                {}
            );

            return {
                ...deploymentData,
                items: deploymentData.items.map(item => {
                    return {
                        ...item,
                        nodeInstancesCount: nodeInstanceData[item.id] ? nodeInstanceData[item.id].count : 0,
                        nodeInstancesStates: nodeInstanceData[item.id] ? nodeInstanceData[item.id].states : {},
                        created_at: Stage.Utils.Time.formatTimestamp(item.created_at), // 2016-07-20 09:10:53.103579
                        updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
                        isUpdated: !isEqual(item.created_at, item.updated_at),
                        lastExecution: latestExecutionData[item.id]
                    };
                }),
                total: get(deploymentData, 'metadata.pagination.total', 0),
                blueprintId: params.blueprint_id,
                // eslint-disable-next-line no-underscore-dangle
                searchValue: params?._search
            };
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;
        const {
            configuration: { showFirstUserJourneyButtons }
        } = widget;
        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const searchValue = data?.searchValue;
        const shouldShowFirstUserJourneyButtons = showFirstUserJourneyButtons && !searchValue && isEmpty(data?.items);

        if (shouldShowFirstUserJourneyButtons) {
            return <FirstUserJourneyButtons toolbox={toolbox} />;
        }

        const selectedDeployment = toolbox.getContext().getValue('deploymentId');
        const formattedData: DeploymentsListData = {
            ...data,
            items: data.items.map(item => {
                return {
                    ...item,
                    isSelected: selectedDeployment === item.id
                };
            })
        };

        return <DeploymentsList widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
