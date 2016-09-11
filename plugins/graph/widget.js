/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "graph",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'graph: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});