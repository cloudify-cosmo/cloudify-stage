import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import ExecutionsService from './ExecutionsService';
import NodeStatusService from './NodeStatusService';

export function createBlueprintData(data) {
    const { plan } = data.data;

    // is execution in progress?
    const inProgress = data.executions ? ExecutionsService.isRunning(data.executions) : false;

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
            const state = NodeStatusService.getNodeState(inProgress, nodeInstances);

            node.deployStatus = {
                label: state,
                completed: _.size(_.filter(instancesPerNode[node.id], NodeStatusService.isCompleted)),
                icon: NodeStatusService.getContentByStatus(state),
                color: NodeStatusService.getColorByStatus(state),
                states: NodeStatusService.getInstancesCountPerState(nodeInstances)
            };

            if (
                NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.componentType) ||
                NodeDataUtils.isInheritedFrom(node.type_hierarchy, Consts.sharedResourceType)
            ) {
                node.deploymentSettings = {};
                _.each(nodeInstances, nodeInstance => {
                    if (nodeInstance.runtime_properties && nodeInstance.runtime_properties.deployment) {
                        node.deploymentSettings[nodeInstance.id] = {
                            id: nodeInstance.runtime_properties.deployment.id
                        };
                    }
                });
            }
        }

        _.each(node.relationships, rel => {
            rel.target = rel.target_id;
        });
    });

    return { node_templates: _.keyBy(plan.nodes, 'name'), groups: plan.groups };
}

/**
 * @description
 * removes 'plan' from topologyData and splits it to node_templates and hierarchy.
 * if 'plan' does not exists, does nothing.
 *
 * @param {object} data
 * @param {object} data.data.plan raw data from manager. contains both nodes and type_hierarchy
 */
export function createBaseTopology(data) {
    const { plan } = data.data;

    if (!plan) {
        return {};
    }

    return DataProcessingService.encodeTopology(createBlueprintData(data), createHierarchy(plan));
}

let componentNodeId = 0;
export function createExpandedTopology(topologyData, extendedNode) {
    /* Converting the topology of extended node's remote deployment (which is relevant
     * in the case of node type like Component or SharedResource that are proxy to a
     * remote deployment) to widget format and embedding it in the node view, which is
     * done by creating a fake contained-in relationship and behavior.
     */
    const res = createBaseTopology(topologyData);

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

export function createHierarchy(blueprintPlan = []) {
    const hierarchy = {};

    _.each(blueprintPlan.nodes, node => {
        hierarchy[node.type] = _.reverse(node.type_hierarchy);

        _.each(node.relationships, rel => {
            hierarchy[rel.type] = _.reverse(rel.type_hierarchy);
        });
    });

    return hierarchy;
}
