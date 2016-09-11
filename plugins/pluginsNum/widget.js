/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "pluginsNum",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 2,
    color: "teal",
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'Plugins num: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});