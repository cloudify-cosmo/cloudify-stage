export {};

type Item = {
    // eslint-disable-next-line camelcase
    node_instances: number;
    state: string;
};

type NodeInstancesSummaryResponse = {
    items?: Item[];
    metadata: any;
};

Stage.defineWidget<unknown, NodeInstancesSummaryResponse, unknown>({
    id: 'nodesStats',
    name: 'Nodes statistics',
    description: 'This widget shows number of node instances in different states',
    initialWidth: 4,
    initialHeight: 22,
    color: 'green',
    isReact: true,
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

        const states = _.reduce(
            data?.items,
            (result: Record<string, number>, item) => {
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
