/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "blueprints",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'blah';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});