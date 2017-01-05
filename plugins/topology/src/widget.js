/**
 * Created by kinneretzin on 07/09/2016.
 */

import Topology from './Topology';
import DataFetcher from './DataFetcher';

let getConfig = (widgetConfig,id) =>{
    var conf = widgetConfig ? _.find(widgetConfig,{id:id}) : {};
    return (conf && conf.value === 'true');
};

Stage.addPlugin({
    id: 'topology',
    name: "Topology",
    description: 'Shows topology (blueprint or deployment)',
    initialWidth: 8,
    initialHeight: 4,
    color: "yellow",
    isReact: true,
    hasTemplate: true,
    initialConfiguration: [
        {id: 'enableNodeClick', name: 'Enable node click' ,placeHolder:"true of false", default:"true"},
        {id: 'enableGroupClick', name: 'Enable group click' ,placeHolder:"true of false", default:"true"},
        {id: 'enableZoom', name: 'Enable zoom' ,placeHolder:"true of false", default:"true"},
        {id: 'enableDrag', name: 'Enable drag' ,placeHolder:"true of false", default:"true"},
        {id: 'showToolbar', name: 'Show toolbar' ,placeHolder:"true of false", default:"true"}
    ],

    fetchData: function(plugin,toolbox) {
        var deploymentId = toolbox.getContext().getValue('deploymentId');
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        return DataFetcher.fetch(toolbox,blueprintId,deploymentId);
    },

    render: function(widget,data,error,toolbox) {
        if (!widget.plugin.template) {
            return 'Topology: missing template';
        }

        var topologyConfig = {
            enableNodeClick: widget.configuration.enableNodeClick === 'true',
            enableGroupClick: widget.configuration.enableGroupClick === 'true',
            enableZoom: widget.configuration.enableZoom === 'true',
            enableDrag: widget.configuration.enableDrag === 'true',
            showToolbar: widget.configuration.showToolbar === 'true'
        };

        var topologyTemplate = _.template(widget.plugin.template)(topologyConfig);
        var deploymentId = toolbox.getContext().getValue('deploymentId');
        var blueprintId = toolbox.getContext().getValue('blueprintId');

        var formattedData = Object.assign({},data,{
            deploymentId,
            blueprintId,
            topologyConfig
        });
        return <Topology template={topologyTemplate} widget={widget} data={formattedData} toolbox={toolbox}/>;

    }

});