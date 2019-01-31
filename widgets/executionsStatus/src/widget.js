
Stage.defineWidget({
    id: 'executionsStatus',
    name: 'Executions Statuses Graph',
    description: 'Shows the number of executions per status',
    initialWidth: 4,
    initialHeight: 24,
    color : 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionsStatus'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5)
    ],
    fetchUrl: '[manager]/summary/executions?_target_field=status_display&[params]',

    fetchParams: function(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            id: toolbox.getContext().getValue('executionId'),
            status_display: toolbox.getContext().getValue('executionStatus')
        };
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }
        if (_.isEmpty(data.items)) {
            return <p>There are no Executions available.</p>;
        }
        const formatted_data = _.map(data.items, (status_sum) => ({'status': _.startCase(status_sum.status_display),
            'number_of_executions': status_sum.executions}));
        let {Graph} = Stage.Basic.Graphs;
        const charts = [{name:'number_of_executions', label:'Number of executions', axisLabel:'status'}];
        return (<Graph type={Graph.BAR_CHART_TYPE} data={formatted_data} charts={charts} xDataKey='status' />);
    }
});
