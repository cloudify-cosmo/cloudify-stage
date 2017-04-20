/**
 * Created by jakubniezgoda on 15/03/2017.
 */

Stage.defineWidget({
    id: 'graph',
    name: 'Deployment metric graph',
    description: 'Display graph with deployment metric data',
    initialWidth: 6,
    initialHeight: 20,
    showHeader: true,
    showBorder: true,
    isReact: true,
    color: "blue",
    initialConfiguration: [
        {id: "deploymentId", name: "Deployment ID", placeHolder: "If not set, then will be taken from context", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "metric", name: "Metric", placeHolder: "Metric data to be presented on the graph", default: "memory_MemFree", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name: "cpu_total_system", value: "cpu_total_system"}, {name: "cpu_total_user", value: "cpu_total_user"},
                 {name: "memory_MemFree", value: "memory_MemFree"}, {name: "memory_SwapFree", value: "memory_SwapFree"},
                 {name: "loadavg_processes_running", value: "loadavg_processes_running"}]},
        {id: "from", name: "Time range start", placeHolder: "Start time for data to be presented", default: "now() - 15m", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'last 15 minutes', value:'now() - 15m'}, {name:'last hour', value:'now() - 1h'}, {name:'last day', value: 'now() - 1d'}]},
        {id: "to", name: "Time range end", placeHolder: "End time for data to be presented", default: "now()", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'now', value:'now()'}]},
        {id: "resolution", name: "Time resolution value",  placeHolder: "Time resolution value", default: "1", type: Stage.Basic.GenericField.NUMBER_TYPE,
         min: Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE, max: Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE},
        {id: "unit", name: "Time resolution unit", placeHolder: "Time resolution unit", default: "m", type: Stage.Basic.GenericField.LIST_TYPE,
            items: Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS},
        {id: "query", name: "Database query", placeHolder: "InfluxQL query to fetch input data for the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "type", name: "Graph type", items: [{name:'Line chart', value:Stage.Basic.Graphs.Graph.LINE_CHART_TYPE}, {name:'Bar chart', value:Stage.Basic.Graphs.Graph.BAR_CHART_TYPE}],
         default: Stage.Basic.Graphs.Graph.LINE_CHART_TYPE, type: Stage.Basic.GenericField.LIST_TYPE},
        {id: "label", name: "Graph label",  placeHolder: "Data label to be shown on the graph", default: "", type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    _prepareData: function(data, xDataKey, yDataKey) {
        const TIME_FORMAT = "HH:mm:ss";
        const MAX_NUMBER_OF_POINTS = 500;

        // Data optimization (show no more than MAX_NUMBER_OF_POINTS points on the graph)
        if (data.length > MAX_NUMBER_OF_POINTS) {
            let optimizedData = [];
            let delta = parseFloat(data.length / MAX_NUMBER_OF_POINTS);
            for (let i = 0; i < data.length; i = i + delta) {
                optimizedData.push(data[Math.floor(i)]);
            }
            data = optimizedData;
        }

        // Convert data to recharts format
        data = _.map(data, (element) => ({
            [xDataKey]: Stage.Utils.formatTimestamp(element[0], TIME_FORMAT, null),
            [yDataKey]: element[1]
        }));

        return data;
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;

        let timeFilter = toolbox.getContext().getValue('timeFilter');

        let timeStart = timeFilter && timeFilter.start;
        timeStart = timeStart ? `${moment(timeStart).unix()}s` : widget.configuration.from;

        let timeEnd = timeFilter && timeFilter.end;
        timeEnd = timeEnd ? `${moment(timeEnd).unix()}s` : widget.configuration.to;

        let timeResolutionValue = timeFilter && timeFilter.resolution;
        let timeResolutionUnit = timeFilter && timeFilter.unit;
        let timeGroup = timeResolutionValue && timeResolutionUnit
            ? `${timeResolutionValue}${timeResolutionUnit}`
            : `${widget.configuration.resolution}${widget.configuration.unit}`;

        return { deploymentId, timeStart, timeEnd, timeGroup };
    },

    fetchData: function(widget, toolbox, params) {
        let query = widget.configuration.query;
        let actions = new Stage.Common.InfluxActions(toolbox);

        if (!_.isEmpty(query)) {
            return actions.doRunQuery(query).then((data) => Promise.resolve(data))
        } else {
            let deploymentId = params.deploymentId;
            let metric = widget.configuration.metric;
            if (!_.isEmpty(deploymentId) && !_.isEmpty(metric)) {
                let from = params.timeStart;
                let to = params.timeEnd;
                let timeGroup = params.timeGroup;
                return actions.doGetMetric(deploymentId, metric, from, to, timeGroup).then((data) => Promise.resolve(data))
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