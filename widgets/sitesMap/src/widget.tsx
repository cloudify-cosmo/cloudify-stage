import SitesMap from './SitesMap';
import type { SitesMapWidgetConfiguration, SitesMapWidgetData, SitesMapWidgetParams } from './types';

Stage.defineWidget<SitesMapWidgetParams, SitesMapWidgetData, SitesMapWidgetConfiguration>({
    id: 'sitesMap',
    name: 'Sites Map',
    description: 'This widget displays a map view of sites by location with site deployments status summary',
    initialWidth: 6,
    initialHeight: 30,
    color: 'green',
    isReact: true,
    hasReadme: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('sitesMap'),
    categories: [Stage.GenericConfig.CATEGORY.SPIRE],
    supportedEditions: [Stage.Common.Consts.licenseEdition.premium, Stage.Common.Consts.licenseEdition.spire],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showAllLabels',
            name: 'Show all the site labels',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchParams(_widget, toolbox) {
        return {
            blueprint_id: toolbox.getContext().getValue('blueprintId'),
            id: toolbox.getContext().getValue('deploymentId')
        };
    },

    fetchData(_widget, toolbox, params) {
        const sitesWithLocation = toolbox
            .getManager()
            .doGet('/sites', {
                _include: 'name,latitude,longitude',
                _get_all_results: true
            })
            .then(data => _.filter(data.items, site => !_.isNil(site.latitude)));

        const sitesSummaries = toolbox
            .getManager()
            .doGet('/summary/deployments', {
                _include: 'id,site_name,deployment_status',
                _target_field: 'site_name',
                _sub_field: 'deployment_status',
                ...params
            })
            .then(data => _.filter(data.items, item => item.site_name));

        return Promise.all([sitesWithLocation, sitesSummaries]).then(([sites, summaries]) => {
            const sitesMapWidgetData: SitesMapWidgetData = {};

            sites.forEach(site => {
                sitesMapWidgetData[site.name] = {
                    ...site,
                    deploymentStates: {
                        good: 0,
                        in_progress: 0,
                        requires_attention: 0
                    }
                };
            });

            summaries.forEach(summary => {
                const { site_name: siteName, 'by deployment_status': deploymentsByStatus } = summary;

                function getDeploymentStatuses(
                    statusObjects: {
                        // eslint-disable-next-line camelcase
                        deployment_status: Stage.Common.DeploymentsView.Types.DeploymentStatus;
                        deployments: number;
                    }[]
                ) {
                    const deploymentStatuses: Record<string, number> = {};

                    statusObjects.forEach(statusObject => {
                        deploymentStatuses[statusObject.deployment_status] = statusObject.deployments;
                    });

                    return deploymentStatuses;
                }

                const deploymentStates = getDeploymentStatuses(deploymentsByStatus);
                sitesMapWidgetData[siteName].deploymentStates = deploymentStates;
            });

            return sitesMapWidgetData;
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!data || _.isEmpty(data)) {
            return <Loading />;
        }

        return (
            <SitesMap
                data={data}
                dimensions={Stage.Common.Map.getWidgetDimensions(widget)}
                showAllLabels={widget.configuration.showAllLabels}
                sitesAreDefined={Object.keys(data).length > 0}
                toolbox={toolbox}
            />
        );
    }
});
