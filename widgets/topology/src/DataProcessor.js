import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import { consts } from 'cloudify-ui-common';
import {
    isCompleted,
    getColorByStatus,
    getContentByStatus,
    getInstancesCountPerState,
    getNodeState
} from './NodeStatusService';

/**
 * @typedef {object} BlueprintData
 * @property {object} data.data.plan Raw blueprint data from manager
 * @property {boolean} data.inProgress
 * @property {Array} data.instances
 */

/**
 * Takes blueprint plan, as returned by manager, as well as inProgress flag and instances data and transforms it into
 * yaml-compatible blueprint data structure containing 'node_templaes' and 'groups' properties
 *
 * @param {BlueprintData} data
 */
export function createBlueprintData(data) {
    const { plan } = data.data;

    let instancesPerNode = null;
    if (data.instances) {
        instancesPerNode = _.groupBy(data.instances, 'node_id');
    }

    _.each(plan.nodes, node => {
        node.actual_planned_number_of_instances =
            node.actual_planned_number_of_instances ||
            _.get(node, 'capabilities.scalable.properties.default_instances') ||
            1;

        if (instancesPerNode) {
            const nodeInstances = instancesPerNode[node.id];
            const state = getNodeState(data.inProgress, nodeInstances);

            if (state !== consts.nodeStatuses.UNINITIALIZED)
                node.deployStatus = {
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
                    node.deploymentId = _.chain(nodeInstances)
                        .head()
                        .get('runtime_properties.deployment.id')
                        .value();
                } else if (NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.terraformModuleType)) {
                    node.terraformResources = _.chain(nodeInstances)
                        .head()
                        .get('runtime_properties.resources')
                        .value();
                }
            }
        }

        _.each(node.relationships, rel => {
            rel.target = rel.target_id;
        });
    });

    return { node_templates: _.keyBy(plan.nodes, 'name'), groups: plan.groups };
}

/**
 * Takes blueprint plan, as returned by manager, as well as inProgress flag and instances data and transforms it into
 * topology compatible blueprint data structure containing 'nodes', 'connectors' and 'groups' properties
 *
 * @param {BlueprintData} data
 */
export function createBaseTopology(data) {
    const { plan } = data.data;

    if (!plan) {
        return {};
    }

    return DataProcessingService.encodeTopology(createBlueprintData(data), createHierarchy(plan));
}

let componentNodeId = 0;

/**
 * Takes component's blueprint data, creates a topology and nests it inside given component node
 *
 * @param {BlueprintData} componentBlueprintData
 * @param {object} extendedNode Topology comopnent node to be extended
 */
export function createExpandedTopology(componentBlueprintData, extendedNode) {
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

/**
 * Creates hierarchy map out of blueprint plan as returned by manager
 *
 * @param {object} blueprintPlan
 */
export function createHierarchy(blueprintPlan) {
    const hierarchy = {};

    _.each(blueprintPlan.nodes, node => {
        hierarchy[node.type] = _.reverse(node.type_hierarchy);

        _.each(node.relationships, rel => {
            hierarchy[rel.type] = _.reverse(rel.type_hierarchy);
        });
    });

    return hierarchy;
}
