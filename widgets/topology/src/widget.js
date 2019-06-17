/**
 * Created by kinneretzin on 07/09/2016.
 */

import Topology from './Topology';
import DataFetcher from './DataFetcher';

Stage.defineWidget({
    id: 'topology',
    name: "Topology",
    description: 'Shows topology (blueprint or deployment)',
    initialWidth: 8,
    initialHeight: 16,
    color: "yellow",
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('topology'),
    hasStyle: true,
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {id: 'enableNodeClick', name: 'Enable node click', default:true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'enableGroupClick', name: 'Enable group click', default:true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'enableZoom', name: 'Enable zoom', default:true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'enableDrag', name: 'Enable drag', default:true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: 'showToolbar', name: 'Show toolbar', default:true, type: Stage.Basic.GenericField.BOOLEAN_TYPE}
    ],

    fetchData: function(widget,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        let deploymentsToFetch = toolbox.getContext().getValue('deploymentsToExpand');
        let expandedDeployments = {}
        _.each(deploymentsToFetch,(depId)=>{
            expandedDeployments[depId] = DataFetcher.fetch(toolbox,null,depId);
        });

        let deploymentData = DataFetcher.fetch(toolbox, blueprintId, deploymentId);
        deploymentData.expandedDeployments = expandedDeployments;

        return DataFetcher.fetch(toolbox, blueprintId, deploymentId);
    },

    render: function(widget,data,error,toolbox) {
        console.info(data);
        let topologyConfig = {
            enableNodeClick: widget.configuration.enableNodeClick,
            enableGroupClick: widget.configuration.enableGroupClick,
            enableZoom: widget.configuration.enableZoom,
            enableDrag: widget.configuration.enableDrag,
            showToolbar: widget.configuration.showToolbar
        };

        let deploymentId = toolbox.getContext().getValue('deploymentId');
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        let formattedData = Object.assign({},data,{
            deploymentId,
            blueprintId,
            topologyConfig
        });
        return <Topology widget={widget} data={formattedData} toolbox={toolbox}/>;

    }

});