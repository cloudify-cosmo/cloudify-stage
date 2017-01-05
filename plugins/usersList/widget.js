/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.addPlugin({
    id: "usersList",
    name: "Users list",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 3,
    color: "orange",
    hasTemplate: true,
    render: function(widget,data,error,toolbox) {

        if (!widget.plugin.template) {
            return 'usersList: missing template';
        }

        return _.template(widget.plugin.template)();
    }
});