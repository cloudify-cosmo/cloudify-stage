import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export {};

const t = Stage.Utils.getT('widgets.nodesStats');

type Item = {
    // eslint-disable-next-line camelcase
    node_instances: number;
    state: string;
};

type NodeInstancesSummaryResponse = Stage.Types.PaginatedResponse<Item>;

interface WidgetParams {
    // eslint-disable-next-line camelcase
    deployment_id?: string | string[] | null;
}

Stage.defineWidget<WidgetParams, NodeInstancesSummaryResponse, PollingTimeConfiguration>({
    id: 'nodesStats',
    initialWidth: 4,
    initialHeight: 22,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodesStats'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(10)],
    fetchUrl: '[manager]/summary/node_instances?_target_field=state[params:deployment_id]',

    fetchParams(_widget, toolbox) {
        return {
            deployment_id: toolbox.getContext().getValue('deploymentId')
        };
    },

    render(_widget, data) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const { PieGraph } = Stage.Shared;
        const { NodeInstancesConsts } = Stage.Common;

        const states = _.reduce<Item, Record<string, number>>(
            data?.items,
            (result, item) => {
                result[item.state] = item.node_instances;
                return result;
            },
            {}
        );

        const formattedData = _.map(NodeInstancesConsts.groupStates, groupState => ({
            name: _.upperFirst(groupState.name),
            color: groupState.colorHTML,
            value: _.sum(_.map(groupState.states, state => (_.isNumber(states[state]) ? states[state] : 0)))
        }));

        return <PieGraph data={formattedData} />;
    }
});
