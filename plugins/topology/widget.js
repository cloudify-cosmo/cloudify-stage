/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'topology',
    name: "topology",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color: "yellow",
    initialConfiguration: {filter_by: "yo yo yo"},
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Topology: missing template';
        }

        var deploymentId = context.getValue('deploymentId');
        var topologyData = {
            topologyPic: '/plugins/topology/topology1.png'
        };
        if (deploymentId) {
            if (deploymentId.indexOf('drupal') >= 0 ){
                topologyData.topologyPic = '/plugins/topology/topology2.png';
            } else if (deploymentId.indexOf('winpoc-n') >= 0 ){
                topologyData.topologyPic = '/plugins/topology/topology3.png';
            } // Else we stick with topology1
        }
        return pluginUtils.buildFromTemplate(widget.plugin.template,topologyData);

    }
});