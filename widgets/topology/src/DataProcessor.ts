import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import { consts } from 'cloudify-ui-common-frontend';
import type { BlueprintPlan, Node } from 'app/widgets/common/blueprints/BlueprintActions';
import { map } from 'lodash';
import type {
    ManagerData,
    NodeInstance,
    NodeTemplateData,
    StageTopologyData,
    StageTopologyElement
} from './widget.types';
import {
    getColorByStatus,
    getContentByStatus,
    getInstancesCountPerState,
    getNodeState,
    isCompleted
} from './NodeStatusService';

/**
 * Takes blueprint plan, as returned by manager, as well as inProgress flag and instances data and transforms it into
 * yaml-compatible blueprint data structure containing 'node_templaes' and 'groups' properties
 *
 * @param {BlueprintData} data
 */
export function createBlueprintData(data: ManagerData) {
    const plan = data.data?.plan;

    let instancesPerNode: Record<string, NodeInstance[]> | undefined;
    if (data.instances) {
        instancesPerNode = _.groupBy(data.instances, 'node_id');
    }

    const nodes = map(plan?.nodes, node => {
        const enchancedNode: NodeTemplateData = {
            ...node,
            actual_planned_number_of_instances:
                node.actual_planned_number_of_instances ||
                _.get(node, 'capabilities.scalable.properties.default_instances') ||
                1,
            relationships: node.relationships?.map(relationship => ({
                ...relationship,
                target: relationship.target_id
            }))
        };

        if (instancesPerNode) {
            const nodeInstances = instancesPerNode[node.id];
            const state = getNodeState(!!data.inProgress, nodeInstances);

            if (state !== consts.nodeStatuses.UNINITIALIZED)
                enchancedNode.deployStatus = {
                    label: state,
                    completed: _.size(_.filter(instancesPerNode[node.id], isCompleted)),
                    icon: getContentByStatus(state),
                    color: getColorByStatus(state),
                    states: getInstancesCountPerState(nodeInstances)
                };

            if (node.actual_number_of_instances === 1) {
                if (
                    NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.componentType) ||
                    NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.sharedResourceType)
                ) {
                    enchancedNode.deploymentId = nodeInstances[0].runtime_properties.deployment.id;
                } else if (NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.terraformModuleType)) {
                    enchancedNode.terraformResources = nodeInstances[0].runtime_properties.resources;
                }
            }
        }

        return enchancedNode;
    });

    return { node_templates: _.keyBy(nodes, 'name'), groups: plan?.groups };
}

/**
 * Creates hierarchy map out of blueprint plan as returned by manager
 *
 * @param {object} blueprintPlan
 */
export function createHierarchy(blueprintPlan: BlueprintPlan) {
    const hierarchy: Record<string, Node['type_hierarchy']> = {};

    _.each(blueprintPlan.nodes, node => {
        hierarchy[node.type] = _.reverse(node.type_hierarchy);

        _.each(node.relationships, rel => {
            hierarchy[rel.type] = _.reverse(rel.type_hierarchy);
        });
    });

    return hierarchy;
}

/**
 * Takes blueprint plan, as returned by manager, as well as inProgress flag and instances data and transforms it into
 * topology compatible blueprint data structure containing 'nodes', 'connectors' and 'groups' properties
 *
 * @param {BlueprintData} data
 */
export function createBaseTopology(data?: ManagerData) {
    if (!data) {
        return undefined;
    }

    const plan = data.data?.plan;

    if (!plan) {
        return undefined;
    }

    const blueprintData = createBlueprintData(data);
    const hierarchy = createHierarchy(plan);

    return DataProcessingService.encodeTopology(blueprintData, hierarchy);
}

let componentNodeId = 0;

/**
 * Takes component's blueprint data, creates a topology and nests it inside given component node
 *
 * @param {BlueprintData} componentBlueprintData
 * @param {object} extendedNode Topology comopnent node to be extended
 */
export function createExpandedTopology(componentBlueprintData: StageTopologyData, extendedNode: StageTopologyElement) {
    /* Converting the topology of extended node's remote deployment (which is relevant
     * in the case of node type like Component or SharedResource that are proxy to a
     * remote deployment) to widget format and embedding it in the node view, which is
     * done by creating a fake contained-in relationship and behavior.
     */
    const res = _.cloneDeep(componentBlueprintData);

    _.each(res.nodes, (node, index) => {
        const rel = {
            type: 'cloudify.relationships.contained_in',
            target: extendedNode.id,
            type_hierarchy: ['cloudify.relationships.contained_in', 'cloudify.relationships.depends_on']
        };

        const containedInSettings = {
            id: `componentNode${componentNodeId}`,
            name: Consts.newConnectorNamePrefix + (index + 1),
            templateData: rel,
            side1: node,
            side2: extendedNode
        };
        componentNodeId += 1;

        // Set the extended topology to be in the extended node.
        extendedNode.children = extendedNode.children || [];
        extendedNode.children.push(node);

        // Connect a node in the topology to extended node.
        node.container = {
            type: rel.type,
            parent: extendedNode,
            containedIn: containedInSettings
        };
    });

    return res;
}
