/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "pluginsNum",
    name: "Number of plugins",
    description: 'blah blah blah',
    initialWidth: 2,
    initialHeight: 2,
    color: "teal",
    showHeader: false,
    render: function(plugin,data,context,pluginUtils) {

        if (!plugin.template) {
            return 'Plugins num: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});