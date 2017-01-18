/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodesTable from './NodesTable';

Stage.defineWidget({
    id: 'nodes',
    name: 'Nodes list',
    description: 'This widget shows nodes',
    initialWidth: 6,
    initialHeight: 5,
    color : 'blue',
    isReact: true,
    initialConfiguration: [],
    fetchUrl: {
        nodes: '[manager]/nodes?_include=id,deployment_id,blueprint_id,type,number_of_instances,host_id,relationships[params]',
        nodeInstances: '[manager]/node-instances?_include=id,node_id,deployment_id,state,relationships,runtime_properties[params:deployment_id]'
    },
    pageSize: 5,

    fetchParams: function(widget, toolbox) {
        return {
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            blueprint_id: toolbox.getContext().getValue('blueprintId')
        }
    },

    render: function(widget, data, error, toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const CONNECTED_TO_RELATIONSHIP = 'cloudify.relationships.connected_to';
        const SELECTED_NODE_ID = toolbox.getContext().getValue('nodeId');

        let params = this.fetchParams(widget, toolbox);

        let nodes = data.nodes.items;
        let instances = data.nodeInstances.items;

        let formattedData = Object.assign({}, data.nodes, {
            items: _.map (nodes, (node) => {
                return Object.assign({}, node, {
                    deploymentId: node.deployment_id,
                    blueprintId: node.blueprint_id,
                    containedIn: node.host_id,
                    connectedTo: node.relationships.filter((r) => r.type === CONNECTED_TO_RELATIONSHIP)
                                                   .map((r) => r.target_id)
                                                   .join(','),
                    numberOfInstances: node.number_of_instances,
                    instances: instances.filter((instance) =>
                                                instance.node_id === node.id &&
                                                instance.deployment_id === node.deployment_id),
                    isSelected: (node.id + node.deployment_id) === SELECTED_NODE_ID
                })
            }),
            total : _.get(data.nodes, 'metadata.pagination.total', 0),
            blueprintId : params.blueprint_id,
            deploymentId : params.deployment_id
        });

        return (
            <NodesTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});