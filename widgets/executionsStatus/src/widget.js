
Stage.defineWidget({
    id: 'executionsStatus',
    name: 'Executions Statuses Graph',
    description: 'Shows the number of executions per status',
    initialWidth: 4,
    initialHeight: 24,
    color : 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionNum'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10)
    ],
    fetchUrl: '[manager]/summary/executions?_target_field=status_display&[params]',

    fetchParams: function(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            id: toolbox.getContext().getValue('executionId')
        };
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data) || _.isEmpty(data.items)) {
            return <Stage.Basic.Loading/>;
        }
        const status_data = _.groupBy(data.items, 'status_display');
        const formatted_data = _.map(status_data,
            (executions, status) => ({'status': _.startCase(status), 'number_of_executions': executions.length}));
        let {Graph} = Stage.Basic.Graphs;
        const charts = [{name:'number_of_executions', label:'Number of executions', axisLabel:'status'}];
        return (<Graph type={Graph.BAR_CHART_TYPE} data={formatted_data} charts={charts} xDataKey='status' />);
    }
});
