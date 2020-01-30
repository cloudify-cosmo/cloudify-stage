import { Consts, DataProcessingService, NodeDataUtils } from 'cloudify-blueprint-topology';
import ExecutionsService from './ExecutionsService';
import NodeStatusService from './NodeStatusService';

export default function createHierarchy(blueprintPlan = []) {
    const hierarchy = {};

    _.each(blueprintPlan.nodes, node => {
        hierarchy[node.type] = _.reverse(node.type_hierarchy);

        _.each(node.relationships, rel => {
            hierarchy[rel.type] = _.reverse(rel.type_hierarchy);
            rel.target = rel.target_id;
        });
    });

    return hierarchy;
}
