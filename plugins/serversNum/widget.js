/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "serversNum",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 2,
    color: "green",
    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'ServersNum: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});