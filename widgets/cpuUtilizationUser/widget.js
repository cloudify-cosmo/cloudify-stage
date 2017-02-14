/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.defineWidget({
    id: "cpuUtilizationUser",
    name: "CPU Utilization - User",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 20,
    color : "purple",
    hasTemplate: true,
    render: function(widget,data,error,toolbox) {

        if (!widget.definition.template) {
            return 'graph: missing template';
        }

        return _.template(widget.definition.template)();
    }
});