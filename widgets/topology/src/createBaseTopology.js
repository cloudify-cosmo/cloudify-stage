import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import ExecutionsService from './ExecutionsService';
import NodeStatusService from './NodeStatusService';

/**
 * @description
 * removes 'plan' from topologyData and splits it to node_templates and hierarchy.
 * if 'plan' does not exists, does nothing.
 *
 * @param {object} data
 * @param {object} data.data.plan raw data from manager. contains both nodes and type_hierarchy
 */
export default function createBaseTopology(data) {
    // is execution in progress?
    const inProgress = data.executions ? ExecutionsService.isRunning(data.executions) : false;

    let instancesPerNode = null;
    if (data.instances) {
        instancesPerNode = {};
        _.each(data.instances, function() {
            instancesPerNode = _.groupBy(data.instances, 'node_id');
        });
    }

    if (data.data.plan) {
        const { plan } = data.data;
        data.data = { node_templates: {}, groups: {} };
        data.hierarchy = {};

        _.each(plan.nodes, function(node) {
            // put on map
            data.data.node_templates[node.name] = node;
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
                    _.each(nodeInstances, function(nodeInstance) {
                        if (nodeInstance.runtime_properties && nodeInstance.runtime_properties.deployment) {
                            node.deploymentSettings[nodeInstance.id] = {
                                id: nodeInstance.runtime_properties.deployment.id
                            };
                        }
                    });
                }
            }

            data.hierarchy[node.type] = _(node.type_hierarchy)
                .reverse()
                .value();

            _.each(node.relationships, function(rel) {
                data.hierarchy[rel.type] = _(rel.type_hierarchy)
                    .reverse()
                    .value();
                rel.target = rel.target_id;
            });
        });

        if (plan.groups) {
            data.data.groups = plan.groups;
        }
    }

    return data.layout
        ? DataProcessingService.encodeTopology(data)
        : DataProcessingService.encodeTopologyNoLayout(data);
}
