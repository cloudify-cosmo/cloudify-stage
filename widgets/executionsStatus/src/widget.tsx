import { format as d3format } from 'd3-format';

Stage.defineWidget({
    id: 'executionsStatus',
    name: 'Executions Statuses Graph',
    description: 'Shows the number of executions per status',
    initialWidth: 4,
    initialHeight: 24,
    color: 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionsStatus'),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(5)],
    fetchUrl: '[manager]/summary/executions?_target_field=status_display[params]',

    fetchParams(widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            id: toolbox.getContext().getValue('executionId'),
            status_display: toolbox.getContext().getValue('executionStatus')
        };
    },

    render(widget, data) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }
        if (_.isEmpty(data.items)) {
            const { Message } = Stage.Basic;
            return <Message content="There are no Executions available." />;
        }

        const formattedData = _.sortBy(
            _.map(data.items, statusSum => ({
                status: _.startCase(statusSum.status_display),
                number_of_executions: statusSum.executions
            })),
            statusSum => statusSum.status
        );
        const { Graph } = Stage.Shared;
        const charts = [{ name: 'number_of_executions', label: 'Number of executions', axisLabel: 'status' }];
        return (
            <Graph
                type={Graph.BAR_CHART_TYPE}
                data={formattedData}
                charts={charts}
                xDataKey="status"
                yAxisAllowDecimals={false}
                yAxisDataFormatter={d3format('~s')}
            />
        );
    }
});
