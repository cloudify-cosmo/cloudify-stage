/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    name: "deployments",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'deployments: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template,{blueprintId: context.getValue('blueprintId') || 'none'});
    }
});
