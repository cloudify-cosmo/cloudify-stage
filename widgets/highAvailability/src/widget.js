Stage.defineWidget({
    id: 'highAvailability',
    name: 'Cluster Status',
    description: 'Shows the status of the Cloudify Manager cluster',
    initialWidth: 12,
    initialHeight: 25,
    color: 'green',
    fetchUrl: '[manager]/cluster-status',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('highAvailability'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],

    render(widget, data, error, toolbox) {
        const { Cluster, Loading } = Stage.Basic;

        return _.isEmpty(data) ? (
            <Loading />
        ) : (
            <Cluster.ClusterServicesList services={data.services} toolbox={toolbox} />
        );
    }
});
