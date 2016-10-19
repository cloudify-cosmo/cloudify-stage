/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "cpuUtilizationSystem",
    name: "CPU Utilization - System",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    initialConfiguration: {filterBy: ""},
    render: function(widget,data,error,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'graph: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template);
    }
});