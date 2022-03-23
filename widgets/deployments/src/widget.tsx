// @ts-nocheck File not migrated fully to TS

import DeploymentsList from './DeploymentsList';
import FirstUserJourneyButtons from './FirstUserJourneyButtons';

const t = Stage.Utils.getT('widgets.deployments');

Stage.defineWidget({
    id: 'deployments',
    name: t('name'),
    description: t('description'),
    initialWidth: 8,
    initialHeight: 24,
    color: 'purple',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'clickToDrillDown',
            name: t('configuration.clickToDrillDown.name'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showExecutionStatusLabel',
            name: t('configuration.showExecutionStatusLabel.name'),
            description: t('configuration.showExecutionStatusLabel.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showFirstUserJourneyButtons',
            name: t('configuration.showFirstUserJourneyButtons.name'),
            description: t('configuration.showFirstUserJourneyButtons.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'blueprintIdFilter',
            name: t('configuration.blueprintIdFilter.name'),
            placeHolder: 'Enter the blueprint id you wish to filter by',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'displayStyle',
            name: t('configuration.displayStyle.name'),
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
    isReact: true,
    hasReadme: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchParams(widget, toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');
        blueprintId = _.isEmpty(widget.configuration.blueprintIdFilter)
            ? blueprintId
            : widget.configuration.blueprintIdFilter;
        const obj = { blueprint_id: blueprintId };

        const siteName = toolbox.getContext().getValue('siteName');
        if (siteName) {
            obj.site_name = siteName;
        }

        if (toolbox.getContext().getValue('onlyMyResources')) {
            obj.created_by = toolbox.getManager().getCurrentUsername();
        }
        return obj;
    },

    async fetchData(widget, toolbox, params) {
        const {
            configuration: { showFirstUserJourneyButtons }
        } = widget;

        if (showFirstUserJourneyButtons) {
            const installedDeployments = await new Stage.Common.Actions.Search(toolbox).doListDeployments([
                { key: 'installation_status', values: ['active'], operator: 'any_of', type: 'attribute' }
            ]);
            const shouldDisplayFirstUserJourneyButtons = installedDeployments.items.length === 0;

            if (shouldDisplayFirstUserJourneyButtons) {
                return {
                    showFirstUserJourneyButtons: true
                };
            }
        }

        const deploymentDataPromise = new Stage.Common.Deployments.Actions(toolbox).doGetDeployments({
            _include:
                'id,display_name,blueprint_id,visibility,created_at,created_by,updated_at,inputs,workflows,site_name,latest_execution',
            ...params
        });

        const nodeInstanceDataPromise = deploymentDataPromise
            .then(data => _.map(data.items, item => item.id))
            .then(ids =>
                new Stage.Common.Actions.Summary(toolbox).doGetNodeInstances('deployment_id', {
                    _sub_field: 'state',
                    deployment_id: ids
                })
            );

        const latestExecutionsDataPromise = deploymentDataPromise
            .then(data => _.map(data.items, item => item.latest_execution))
            .then(ids =>
                new Stage.Common.Executions.Actions(toolbox).doGetAll({
                    _include:
                        'id,deployment_id,workflow_id,status,status_display,created_at,scheduled_for,ended_at,parameters,error,total_operations,finished_operations',
                    id: ids
                })
            );

        return Promise.all([deploymentDataPromise, nodeInstanceDataPromise, latestExecutionsDataPromise]).then(data => {
            const { NodeInstancesConsts } = Stage.Common;
            const deploymentData = data[0];
            const nodeInstanceData = _.reduce(
                data[1].items,
                (result, item) => {
                    result[item.deployment_id] = {
                        states: NodeInstancesConsts.extractStatesFrom(item),
                        count: item.node_instances
                    };
                    return result;
                },
                {}
            );
            const latestExecutionData = _.reduce(
                data[2].items,
                (result, latestExecution) => {
                    result[latestExecution.deployment_id] = latestExecution;
                    return result;
                },
                {}
            );

            return {
                ...deploymentData,
                items: _.map(deploymentData.items, item => {
                    return {
                        ...item,
                        nodeInstancesCount: nodeInstanceData[item.id] ? nodeInstanceData[item.id].count : 0,
                        nodeInstancesStates: nodeInstanceData[item.id] ? nodeInstanceData[item.id].states : {},
                        created_at: Stage.Utils.Time.formatTimestamp(item.created_at), // 2016-07-20 09:10:53.103579
                        updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
                        isUpdated: !_.isEqual(item.created_at, item.updated_at),
                        lastExecution: latestExecutionData[item.id]
                    };
                }),
                total: _.get(deploymentData, 'metadata.pagination.total', 0),
                blueprintId: params.blueprint_id
            };
        });
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (data?.showFirstUserJourneyButtons) {
            return <FirstUserJourneyButtons toolbox={toolbox} />;
        }

        const selectedDeployment = toolbox.getContext().getValue('deploymentId');
        const formattedData = {
            ...data,
            items: _.map(data.items, item => {
                return {
                    ...item,
                    isSelected: selectedDeployment === item.id
                };
            })
        };

        return <DeploymentsList widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
