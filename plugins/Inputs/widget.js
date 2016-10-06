/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'inputs',
    name: "Deployment Inputs",
    description: 'This plugin shows the deployment inputs',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    initialConfiguration: {filter_by: ""},
    fetchUrl: '/plugins/inputs/data.json',
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Inputs: missing template';
        }

        data.deploymentId = context.getValue('deploymentId');
        return pluginUtils.buildFromTemplate(widget.plugin.template,data);

    }
});