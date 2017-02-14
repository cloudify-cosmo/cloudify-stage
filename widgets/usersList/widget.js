/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.defineWidget({
    id: "usersList",
    name: "Users list",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 12,
    color: "orange",
    hasTemplate: true,
    hasStyle: true,
    render: function(widget,data,error,toolbox) {

        if (!widget.definition.template) {
            return 'usersList: missing template';
        }

        return _.template(widget.definition.template)();
    }
});