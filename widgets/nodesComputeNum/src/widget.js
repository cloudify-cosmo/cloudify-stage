/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.defineWidget({
    id: 'nodesComputeNum',
    name: 'Number of compute nodes',
    description: 'Number of compute nodes',
    initialWidth: 2,
    initialHeight: 8,
    color : 'red',
    showHeader: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodesComputeNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30)
    ],
    fetchUrl: {
        nodes: '[manager]/nodes?_include=id,type_hierarchy',
        nodeInstances: '[manager]/node-instances?_include=id,node_id&state=started'
    },

    _getNumberOfComputeNodes(nodes, nodeInstances) {
        const COMPUTE_NODE_TYPE = 'cloudify.nodes.Compute';
        let numberOfComputeNodes = 0;

        _.forEach(nodeInstances, (nodeInstance) => {
            let node = _.find(nodes, ['id', nodeInstance.node_id]);
            let typeHierarchy = _.get(node, 'type_hierarchy', []);
            if (_.includes(typeHierarchy, COMPUTE_NODE_TYPE)) {
                numberOfComputeNodes++;
            }
        });

        return numberOfComputeNodes;
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data) || _.isEmpty(data.nodes) || _.isEmpty(data.nodeInstances)) {
            return <Stage.Basic.Loading/>;
        }

        let num = this._getNumberOfComputeNodes(data.nodes.items, data.nodeInstances.items);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Compute Nodes" icon="server" number={num}/>
        );
    }
});