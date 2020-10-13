/**
 * Created by jakub.niezgoda on 11/12/2018.
 */

Stage.defineWidget({
    id: 'nodesComputeNum',
    name: 'Number of compute nodes',
    description: 'Number of compute nodes',
    initialWidth: 2,
    initialHeight: 8,
    color: 'red',
    showHeader: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('nodesComputeNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],
    fetchUrl: '[manager]/summary/node_instances?_target_field=host_id&state=started',

    render(widget, data) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
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
