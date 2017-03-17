/**
 * Created by jakubniezgoda on 15/03/2017.
 */

import InfluxActions from './InfluxActions';

Stage.defineWidget({
    id: 'graph',
    name: 'Graph',
    description: 'Display graph with deployment metric data',
    initialWidth: 8,
    initialHeight: 8,
    showHeader: true,
    showBorder: true,
    isReact: true,
    initialConfiguration: [
        {id: "deploymentId", name: "Deployment ID", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "metric", name: "Metric", placeHolder: "Metric data to be presented on the graph", default: "memory_MemFree", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name: "cpu_total_system", value: "cpu_total_system"}, {name: "cpu_total_user", value: "cpu_total_user"},
                 {name: "memory_MemFree", value: "memory_MemFree"}, {name: "memory_SwapFree", value: "memory_SwapFree"},
                 {name: "loadavg_processes_running", value: "loadavg_processes_running"}]},
        {id: "from", name: "Time from", placeHolder: "Start time for data to be presented", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "to", name: "Time to", placeHolder: "End time for data to be presented", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "query", name: "Database query", placeHolder: "InfluxQL query to fetch input data for the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "type", name: "Graph type", items: [{name:'Line chart', value:'line'}, {name:'Bar chart', value:'bar'}], default: 'line', type: Stage.Basic.GenericField.LIST_TYPE},
        {id: "label", name: "Graph label",  placeHolder: "Data label to be shown on the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    _prepareData: function(data, xDataKey, yDataKey) {
        const TIME_FORMAT = "HH:mm:ss";
        return _.map(data, (element) => ({
            [xDataKey]: moment(element[0]).format(TIME_FORMAT),
            [yDataKey]: element[1]
        }));
    },

    fetchData: function(widget,toolbox,params) {
        let query = widget.configuration.query;
        let actions = new InfluxActions(toolbox);

        if (!_.isEmpty(query)) {
            return actions.doRunQuery(query).then((data) => Promise.resolve(data))
        } else {
            let deploymentId = widget.configuration.deploymentId;
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
        let deploymentId = widget.configuration.deploymentId;
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

        let {Graph, RechartGraph} = Stage.Basic.Graphs;
        let xDataKey = "time";
        let label = widget.configuration.label;
        let type = widget.configuration.type;
        let preparedData = this._prepareData(data[0].points, xDataKey, metric);

        return (
            <RechartGraph xDataKey={xDataKey} yDataKey={metric} data={preparedData} label={label} type={type} />
            // <Graph column={metric} label={label} data={data[0]} type={'line'} />
        );

    }
});