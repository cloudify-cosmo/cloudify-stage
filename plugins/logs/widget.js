/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'logs',
    name: "Deployment Logs",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "yellow",
    fetchUrl: '/plugins/logs/data.json',
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Logs: missing template';
        }

        data.deploymentId = context.getValue('deploymentId');
        return pluginUtils.buildFromTemplate(widget.plugin.template,data);

    }
});