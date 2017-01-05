/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.addPlugin({
    id: "graph",
    name: "some graph",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    hasTemplate: true,
    render: function(widget,data,error,toolbox) {

        if (!widget.plugin.template) {
            return 'graph: missing template';
        }

        return _.template(widget.plugin.template)();
    }
});