import type { PaginatedResponse } from 'backend/types';
import type { FullDeployment } from 'app/widgets/common/deploymentsView/types';
import { castArray } from 'lodash';
import type { Node, NodeInstance, NodesConfiguration } from './types';
import NodesTable from './NodesTable';

const widgetId = 'nodes';

function getGroups(deployments: Deployment[]) {
    const groups: Record<string, string[]> = {};
    _.forEach(deployments, deployment => {
        _.forIn(deployment.groups, (group, groupId) => {
            _.forEach(group.members, nodeId => {
                groups[nodeId + deployment.id] = groups[nodeId + deployment.id] || [];
                const groupList = groups[nodeId + deployment.id];
                groupList.push(groupId);
            });
        });
    });
    return groups;
}

interface NodesParams {
    /* eslint-disable camelcase */
    deployment_id: string | null;
    blueprint_id: string;
    /* eslint-enable camelcase */
    id: string | null;
}

type Deployment = Pick<FullDeployment, 'id' | 'groups'>;

interface NodesData {
    nodes: PaginatedResponse<Node>;
    nodeInstances: PaginatedResponse<NodeInstance>;
    deployments: PaginatedResponse<Deployment>;
}

Stage.defineWidget<NodesParams, NodesData, NodesConfiguration>({
    id: widgetId,
    initialWidth: 6,
    initialHeight: 20,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'fieldsToShow',
            name: 'List of fields to show in the table',
            placeHolder: 'Select fields from the list',
            items: [
                'Name',
                'Type',
                'Blueprint',
                'Deployment',
                'Deployment ID',
                'Contained in',
                'Connected to',
                'Host',
                'Creator',
                '# Instances',
                'Groups'
            ],
            default: 'Name,Type,Blueprint,Deployment,Contained in,Connected to,Host,Creator,# Instances,Groups',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        }
    ],
    fetchUrl: {
        nodes: '[manager]/nodes?_include=id,deployment_id,deployment_display_name,blueprint_id,type,type_hierarchy,actual_number_of_instances,host_id,relationships,created_by[params:blueprint_id,deployment_id,gridParams]',
        nodeInstances:
            '[manager]/node-instances?_include=id,node_id,deployment_id,state,relationships,runtime_properties[params:deployment_id]',
        deployments: '[manager]/deployments?_include=id,groups[params:blueprint_id,id]'
    },

    fetchParams(_widget, toolbox) {
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0];
        const blueprintId = castArray(toolbox.getContext().getValue('blueprintId'))[0];

        return {
            deployment_id: deploymentId,
            blueprint_id: blueprintId,
            id: deploymentId
        };
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const CONNECTED_TO_RELATIONSHIP = 'cloudify.relationships.connected_to';
        const SELECTED_NODE_ID = toolbox.getContext().getValue('depNodeId');
        const SELECTED_NODE_INSTANCE_ID = toolbox.getContext().getValue('nodeInstanceId');

        const params = this.fetchParams!(widget, toolbox);

        const nodes = data.nodes.items;
        const instances = data.nodeInstances.items;
        const groups = getGroups(data.deployments.items);

        const formattedData = {
            items: _.map(nodes, node => {
                const group = groups[node.id + node.deployment_id];
                return {
                    ...node,
                    deploymentId: node.deployment_id,
                    blueprintId: node.blueprint_id,
                    containedIn: node.host_id,
                    connectedTo: node.relationships
                        .filter(r => r.type === CONNECTED_TO_RELATIONSHIP)
                        .map(r => r.target_id)
                        .join(),
                    numberOfInstances: node.actual_number_of_instances,
                    instances: instances
                        .filter(
                            instance => instance.node_id === node.id && instance.deployment_id === node.deployment_id
                        )
                        .map(instance => ({ ...instance, isSelected: instance.id === SELECTED_NODE_INSTANCE_ID })),
                    isSelected: node.id + node.deployment_id === SELECTED_NODE_ID,
                    groups: !_.isNil(group) ? group.join(', ') : ''
                };
            }),
            total: _.get(data.nodes, 'metadata.pagination.total', 0),
            blueprintSelected: !_.isEmpty(params.blueprint_id),
            deploymentSelected: !_.isEmpty(params.deployment_id)
        };

        return <NodesTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
