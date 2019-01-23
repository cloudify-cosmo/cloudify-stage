
Stage.defineWidget({
    id: 'executionsStatus',
    name: 'Executions Statuses Graph',
    description: 'This widget shows the statuses of running executions',
    initialWidth: 6,
    initialHeight: 17,
    color : 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionNum'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10)
    ],
    fetchUrl: '[manager]/executions?_include=id,status&_include_system_workflows=True&' +
              'status=pending&status=started&status=queued&status=scheduled',

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data) || _.isEmpty(data.items)) {
            return <Stage.Basic.Loading/>;
        }
        const status_data = _.groupBy(data.items, 'status');
        const formatted_data = _.map(status_data,
            (executions, status) => ({'status': status, 'number_of_executions': executions.length}));
        let {Graph} = Stage.Basic.Graphs;
        const charts = [{name:'number_of_executions', label:'Number of executions', axisLabel:'status'}];
        return (<Graph type={Graph.BAR_CHART_TYPE} data={formatted_data} charts={charts} xDataKey='status' />);
    }
});
