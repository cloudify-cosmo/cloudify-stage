/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "serversNum",
    name: 'Number of servers',
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 2,
    color: "green",
    showHeader: false,
    render: function(widget,data,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'ServersNum: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template);
    }
});