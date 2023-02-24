import type { PaginatedResponse } from 'backend/types';
import type { FullDeployment } from 'app/widgets/common/deploymentsView/types';
import { castArray } from 'lodash';
import type { Node, NodeInstance, NodesConfiguration } from './types';
import NodesTable from './NodesTable';
import { translateWidget, widgetId } from './utils';

const defaultFieldsToShow = [
    'name',
    'type',
    'blueprint',
    'deployment',
    'containedIn',
    'connectedTo',
    'host',
    'creator',
    'instancesCount',
    'groups'
];
const allFieldsToShow = [...defaultFieldsToShow, 'deploymentId'];
const translateFieldsToShow = Stage.Utils.composeT(translateWidget, 'configuration.fieldsToShow');

type Deployment = Pick<FullDeployment, 'id' | 'groups'>;

function getGroups(deployments: Deployment[]) {
    const groups: Record<string, string[]> = {};
    deployments.forEach(deployment => {
        Object.entries(deployment.groups).forEach(([groupId, group]) => {
            group.members.forEach(nodeId => {
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
            name: translateFieldsToShow('name'),
            placeHolder: translateFieldsToShow('placeholder'),
            items: allFieldsToShow.map(item => translateFieldsToShow(`items.${item}`)),
            default: defaultFieldsToShow.map(item => translateFieldsToShow(`items.${item}`)).join(','),
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

        const connectedToRelationship = 'cloudify.relationships.connected_to';
        const selectedNodeId = toolbox.getContext().getValue('depNodeId');
        const selectedNodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');

        const params = this.fetchParams!(widget, toolbox);

        const nodes = data.nodes.items;
        const instances = data.nodeInstances.items;
        const groups = getGroups(data.deployments.items);

        const formattedData = {
            items: nodes.map(node => ({
                ...node,
                deploymentId: node.deployment_id,
                blueprintId: node.blueprint_id,
                containedIn: node.host_id,
                connectedTo: node.relationships
                    .filter(relationship => relationship.type === connectedToRelationship)
                    .map(relationship => relationship.target_id)
                    .join(),
                numberOfInstances: node.actual_number_of_instances,
                instances: instances
                    .filter(instance => instance.node_id === node.id && instance.deployment_id === node.deployment_id)
                    .map(instance => ({ ...instance, isSelected: instance.id === selectedNodeInstanceId })),
                isSelected: node.id + node.deployment_id === selectedNodeId,
                groups: groups[node.id + node.deployment_id]?.join(', ') || ''
            })),
            total: data.nodes.metadata.pagination.total,
            blueprintSelected: !!params.blueprint_id,
            deploymentSelected: !!params.deployment_id
        };

        return <NodesTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
