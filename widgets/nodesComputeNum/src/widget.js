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
    fetchUrl: '[manager]/node-instances?_include=host_id&state=started',

    _getNumberOfComputeNodes(nodeInstances) {
        return _.size(_.uniq(_.map(nodeInstances, (nodeInstance) => nodeInstance.host_id)));
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let num = this._getNumberOfComputeNodes(data.items);
        let KeyIndicator = Stage.Basic.KeyIndicator;

        return (
            <KeyIndicator title="Compute Nodes" icon="server" number={num}/>
        );
    }
});