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
    initialConfiguration: {filter_by: ""},
    showHeader: false,
    render: function(widget,data,error,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'Plugins num: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template);
    }
});