import type { DeploymentWithUpdate } from 'app/widgets/common/deployments/DeploymentDetails';
import type { DeploymentInfoWidget } from './widget.types';
import DeploymentInfo from './DeploymentInfo';
import Consts from './consts';
import Utils from './utils';

const translate = Utils.getWidgetTranslation();

Stage.defineWidget<DeploymentInfoWidget.Params, DeploymentInfoWidget.Data, DeploymentInfoWidget.Configuration>({
    id: Consts.WIDGET_ID,
    initialWidth: 16,
    initialHeight: 7,
    hasReadme: true,
    showHeader: false,
    showBorder: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(Consts.WIDGET_ID),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showBlueprint',
            name: translate('configuration.showBlueprint'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showSite',
            name: translate('configuration.showSite'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showCreated',
            name: translate('configuration.showCreated'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showUpdated',
            name: translate('configuration.showUpdated'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showCreator',
            name: translate('configuration.showCreator'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showNodeInstances',
            name: translate('configuration.showNodeInstances'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchParams(_widget, toolbox) {
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
        let instancesStates = null;
        let instancesCount = 0;

        if (deploymentId) {
            deployment = await manager
                .doGet<Omit<DeploymentWithUpdate, 'isUpdated'>>(`/deployments/${deploymentId}`, {
                    params: {
                        _include: _.join(
                            _.compact([
                                'id',
                                'display_name',
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
                    }
                })
                .then(deploymentItem => {
                    const { formatTimestamp } = Stage.Utils.Time;
                    const { created_at: createdAt, updated_at: updatedAt } = deploymentItem;

                    return {
                        ...deploymentItem,
                        created_at: formatTimestamp(createdAt),
                        updated_at: formatTimestamp(updatedAt),
                        isUpdated: !_.isEqual(createdAt, updatedAt)
                    };
                });

            const nodeInstancesSummary = configuration.showNodeInstances
                ? await new Stage.Common.Actions.Summary(toolbox).doGetNodeInstances<
                      'deployment_id',
                      string,
                      'state',
                      string
                  >('deployment_id', {
                      _sub_field: 'state',
                      deployment_id: deploymentId
                  })
                : null;

            const { NodeInstancesConsts } = Stage.Common;
            instancesStates = NodeInstancesConsts.extractStatesFrom(_.get(nodeInstancesSummary, 'items[0]', {}));
            instancesCount = NodeInstancesConsts.extractCountFrom(_.get(nodeInstancesSummary, 'items[0]', {}));
        }

        return {
            deployment,
            instancesStates,
            instancesCount
        } as DeploymentInfoWidget.Data;
    },

    render(_widget, data, _error, toolbox) {
        const { Loading, Message } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (_.isEmpty(data?.deployment)) {
            return <Message info>{translate('noDeploymentSelected')}</Message>;
        }

        return <DeploymentInfo data={data as DeploymentInfoWidget.Data} toolbox={toolbox} />;
    }
});
