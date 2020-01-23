import { Consts } from 'cloudify-blueprint-topology';
import createBaseTopology from './createBaseTopology';

let id = 0;

export default function createExpandedTopology(topologyData, extendedNode) {
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
            id: `componentNode${id}`,
            name: Consts.newConnectorNamePrefix + (index + 1),
            templateData: rel,
            side1: node,
            side2: extendedNode
        };
        id += 1;

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
