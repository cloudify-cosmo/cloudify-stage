/**
 * Created by kinneretzin on 07/09/2016.
 */


Stage.defineWidget({
    id: "cpuUtilizationSystem",
    name: "CPU Utilization - System",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color : "blue",
    hasTemplate: true,
    render: function(widget,data,error,toolbox) {

        if (!widget.definition.template) {
            return 'graph: missing template';
        }

        return _.template(widget.definition.template)();
    }
});