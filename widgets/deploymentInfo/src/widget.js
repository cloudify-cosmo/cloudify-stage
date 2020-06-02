import DeploymentInfo from './DeploymentInfo';

Stage.defineWidget({
    id: 'deploymentInfo',
    name: 'Deployment Info',
    description: 'Shows deployment basic information and status',
    initialWidth: 16,
    initialHeight: 7,
    isReact: true,
    hasReadme: false,
    showHeader: false,
    showBorder: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentInfo'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showBlueprint',
            name: 'Show blueprint name',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showSite',
            name: 'Show site name',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showCreated',
            name: 'Show created date',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showUpdated',
            name: 'Show updated date',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showCreator',
            name: 'Show creator',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showNodeInstances',
            name: 'Show node instances status',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchParams(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');

        return {
            deployment_id: deploymentId
        };
    },

    async fetchData(widget, toolbox, params) {
        const deploymentId = params.deployment_id;
        const manager = toolbox.getManager();
        const { configuration } = widget;

        let deployment = {};
        let instancesStates = {};
        let instancesCount = 0;

        if (deploymentId) {
            deployment = await manager
                .doGet(`/deployments/${deploymentId}`, {
                    _include: _.join(
                        _.compact([
                            'id',
                            'description',
                            'visibility',
                            configuration.showBlueprint && 'blueprint_id',
                            configuration.showSite && 'site_name',
                            configuration.showCreated && 'created_at',
                            configuration.showUpdated && 'updated_at',
                            configuration.showCreator && 'created_by'
                        ]),
                        ','
                    )
                })
                .then(deploymentItem =>
                    _.mapValues(deploymentItem, (fieldValue, fieldName) =>
                        fieldName === 'created_at' || fieldName === 'updated_at'
                            ? Stage.Utils.Time.formatTimestamp(fieldValue)
                            : fieldValue
                    )
                );

            const nodeInstancesSummary = configuration.showNodeInstances
                ? await manager.doGet('/summary/node_instances', {
                      _target_field: 'deployment_id',
                      _sub_field: 'state',
                      deployment_id: deploymentId
                  })
                : {};

            const { NodeInstancesConsts } = Stage.Common;
            instancesStates = NodeInstancesConsts.extractStatesFrom(_.get(nodeInstancesSummary, 'items[0]', {}));
            instancesCount = NodeInstancesConsts.extractCountFrom(_.get(nodeInstancesSummary, 'items[0]', {}));
        }

        return {
            deployment,
            instancesStates,
            instancesCount
        };
    },

    render(widget, data, error, toolbox) {
        const { Loading, Message } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (_.isEmpty(data.deployment)) {
            return <Message info>No deployment selected</Message>;
        }

        return <DeploymentInfo data={data} toolbox={toolbox} />;
    }
});
