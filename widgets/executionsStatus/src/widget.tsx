import { format as d3format } from 'd3-format';
import type { ExecutionsStatusWidget } from './types';

const { Loading } = Stage.Basic;
const { Graph } = Stage.Shared;

const widgetId = 'executionsStatus';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<ExecutionsStatusWidget.Params, ExecutionsStatusWidget.Data, ExecutionsStatusWidget.Configuration>({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 4,
    initialHeight: 24,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.EXECUTIONS_NODES, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(5)],
    fetchUrl: '[manager]/summary/executions?_target_field=status_display[params]',

    fetchParams(_widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            deployment_id: toolbox.getContext().getValue('deploymentId'),
            id: toolbox.getContext().getValue('executionId'),
            status_display: toolbox.getContext().getValue('executionStatus')
        };
    },

    render(_widget, data) {
        if (_.isEmpty(data)) {
            return <Loading />;
        }

        if (_.isEmpty(data?.items)) {
            const { Message } = Stage.Basic;
            return <Message content={t('noExecutions')} />;
        }

        const formattedData = _.sortBy(
            _.map(data?.items, statusSum => ({
                status: _.startCase(statusSum.status_display),
                number_of_executions: statusSum.executions
            })),
            statusSum => statusSum.status
        );

        const charts = [{ name: 'number_of_executions', label: t('charts.tooltip.label'), axisLabel: 'status' }];

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
