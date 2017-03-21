/**
 * Created by jakubniezgoda on 15/03/2017.
 */

import InfluxActions from './InfluxActions';

Stage.defineWidget({
    id: 'graph',
    name: 'Deployment metric graph',
    description: 'Display graph with deployment metric data',
    initialWidth: 8,
    initialHeight: 8,
    showHeader: true,
    showBorder: true,
    isReact: true,
    initialConfiguration: [
        {id: "deploymentId", name: "Deployment ID", placeHolder: "If not set, then will be taken from context", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "metric", name: "Metric", placeHolder: "Metric data to be presented on the graph", default: "memory_MemFree", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name: "cpu_total_system", value: "cpu_total_system"}, {name: "cpu_total_user", value: "cpu_total_user"},
                 {name: "memory_MemFree", value: "memory_MemFree"}, {name: "memory_SwapFree", value: "memory_SwapFree"},
                 {name: "loadavg_processes_running", value: "loadavg_processes_running"}]},
        {id: "from", name: "Time from", placeHolder: "Start time for data to be presented", default: "now() - 15m", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'last 15 minutes', value:'now() - 15m'}, {name:'last hour', value:'now() - 1h'}, {name:'last day', value: 'now() - 1d'}]},
        {id: "to", name: "Time to", placeHolder: "End time for data to be presented", default: "now()", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'now', value:'now()'}]},
        {id: "query", name: "Database query", placeHolder: "InfluxQL query to fetch input data for the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "type", name: "Graph type", items: [{name:'Line chart', value:Stage.Basic.Graphs.Graph.LINE_CHART_TYPE}, {name:'Bar chart', value:Stage.Basic.Graphs.Graph.BAR_CHART_TYPE}],
         default: Stage.Basic.Graphs.Graph.LINE_CHART_TYPE, type: Stage.Basic.GenericField.LIST_TYPE},
        {id: "label", name: "Graph label",  placeHolder: "Data label to be shown on the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    _prepareData: function(data, xDataKey, yDataKey) {
        const TIME_FORMAT = "HH:mm:ss";
        return _.map(data, (element) => ({
            [xDataKey]: moment(element[0]).format(TIME_FORMAT),
            [yDataKey]: element[1]
        }));
    },


    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;

        return { deploymentId };
    },

    fetchData: function(widget, toolbox, params) {
        let query = widget.configuration.query;
        let actions = new InfluxActions(toolbox);

        if (!_.isEmpty(query)) {
            return actions.doRunQuery(query).then((data) => Promise.resolve(data))
        } else {
            let deploymentId = params.deploymentId;
            let metric = widget.configuration.metric;
            if (!_.isEmpty(deploymentId) && !_.isEmpty(metric)) {
                let from = widget.configuration.from;
                let to = widget.configuration.to;
                return actions.doGetMetric(deploymentId, metric, from, to).then((data) => Promise.resolve(data))
            } else {
                return Promise.resolve({});
            }
        }
    },

    render: function(widget,data,error,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;
        let metric = widget.configuration.metric;
        let query = widget.configuration.query;
        if ((_.isEmpty(deploymentId) || _.isEmpty(metric)) && _.isEmpty(query)) {
            return (
                <div className="ui icon message">
                    <i className="ban icon"></i>
                    <span>Widget not configured properly. Please provide Metric and Deployment ID or database Query.</span>
                </div>
            );
        }

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let {Graph} = Stage.Basic.Graphs;
        let label = widget.configuration.label;
        let type = widget.configuration.type;
        let preparedData = this._prepareData(data[0].points, Graph.DEFAULT_X_DATA_KEY, metric);

        return (
            <Graph yDataKey={metric} data={preparedData} label={label} type={type} />
        );

    }
});