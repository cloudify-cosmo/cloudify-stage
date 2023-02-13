export {};

// eslint-disable-next-line camelcase
Stage.defineWidget<unknown, { items: { host_id: unknown }[] }, unknown>({
    id: 'nodesComputeNum',
    name: 'Number of compute nodes',
    description: 'Number of compute nodes',
    initialWidth: 2,
    initialHeight: 8,
    showHeader: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodesComputeNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],
    fetchUrl: '[manager]/summary/node_instances?_target_field=host_id&state=started',

    render(_widget, data) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const { KeyIndicator } = Stage.Basic;
        const numberOfComputeNodes = _.chain(data.items)
            .filter(item => !_.isNil(item.host_id))
            .size()
            .value();

        return <KeyIndicator title="Compute Nodes" icon="server" number={numberOfComputeNodes} />;
    }
});
