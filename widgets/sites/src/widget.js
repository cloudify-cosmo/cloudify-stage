import SitesTable from './SitesTable';

Stage.defineWidget({
    id: 'sites',
    name: 'Sites',
    description: 'This widget shows a list of available sites and allow managing them',
    initialWidth: 5,
    initialHeight: 16,
    color: 'blue',
    fetchUrl: {
        sites: '[manager]/sites[params]',
        siteDeploymentCount: '[manager]/summary/deployments?_target_field=site_name'
    },
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('sites'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }
        const { sites, siteDeploymentCount } = data;
        const deploymentsPerSite = {};
        _.forEach(siteDeploymentCount.items, item => {
            deploymentsPerSite[item.site_name] = item.deployments;
        });
        const formattedData = {
            items: _.map(sites.items, site => {
                return {
                    ...site,
                    created_at: Stage.Utils.Time.formatTimestamp(site.created_at),
                    deploymentCount: deploymentsPerSite[site.name] || 0
                };
            }),
            total: _.get(sites, 'metadata.pagination.total', 0)
        };

        return <SitesTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
