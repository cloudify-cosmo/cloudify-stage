/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "deploymentNum",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'DeploymentNum: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});