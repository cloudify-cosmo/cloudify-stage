addPlugin({
    id: "reactTest",
    name: 'A React test',
    description: 'see if we can use react here',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    showHeader: true,
    init: function(pluginUtils) {
        var React = pluginUtils.React;


        class MyComponent extends React.Component {
            render() {
                return (
                    <div>something</div>
                );
            }
        }

    },
    render: function(widget,data,context,pluginUtils) {
        return pluginUtils.buildFromTemplate(widget.plugin.template);
    },
    postRender: function(el,plugin,data,context,pluginUtils) {
    }
});