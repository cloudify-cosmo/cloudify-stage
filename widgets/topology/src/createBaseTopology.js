import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import ExecutionsService from './ExecutionsService';
import NodeStatusService from './NodeStatusService';
import createHierarchy from './createHierarchy';

/**
 * @description
 * removes 'plan' from topologyData and splits it to node_templates and hierarchy.
 * if 'plan' does not exists, does nothing.
 *
 * @param {object} data
 * @param {object} data.data.plan raw data from manager. contains both nodes and type_hierarchy
 */
export default function createBaseTopology(data) {
    const { plan } = data.data;

    if (!plan) {
        return {};
    }

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
    });

    return DataProcessingService.encodeTopology(
        { node_templates: _.keyBy(plan.nodes, 'name'), groups: plan.groups },
        createHierarchy(plan)
    );
}
