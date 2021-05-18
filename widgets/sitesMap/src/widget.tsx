import { isFinite } from 'lodash';
import SitesMap from './SitesMap';
import type { DeploymentStatusesSummary, DeploymentStatus, SitesData } from './types';

const emptyDeploymentStatusesSummary: DeploymentStatusesSummary = {
    good: 0,
    in_progress: 0,
    requires_attention: 0
};
/* eslint-disable camelcase */
interface SiteSummary {
    deployments: number;
    site_name: string;
    'by deployment_status': {
        deployment_status: DeploymentStatus;
        deployments: number;
    }[];
}
/* eslint-enable camelcase */
function getDeploymentStatusesSummary(siteSummary: SiteSummary) {
    const { 'by deployment_status': statusObjects } = siteSummary;

    const deploymentStatuses: DeploymentStatusesSummary = { ...emptyDeploymentStatusesSummary };

    statusObjects.forEach(statusObject => {
        deploymentStatuses[statusObject.deployment_status] = statusObject.deployments;
    });

    return deploymentStatuses;
}

interface SitesMapWidgetParams {
    // eslint-disable-next-line camelcase
    blueprint_id: string | string[] | null;
    id?: string | string[] | null;
}

type SitesMapWidgetData = {
    sitesData: SitesData;
    sitesAreDefined: boolean;
};

interface SitesMapWidgetConfiguration {
    pollingTime: number;
    showAllLabels: boolean;
}

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
        const { DeploymentActions, SummaryActions } = Stage.Common;
        const sitesWithNamesAndLocations: Promise<Stage.Types.PaginatedResponse<
            Stage.Common.Map.SiteWithPosition
        >> = new DeploymentActions(toolbox).doGetSitesNamesAndLocations();

        const sitesSummary: Promise<Stage.Types.PaginatedResponse<SiteSummary>> = new SummaryActions(
            toolbox
        ).doGetDeployments('site_name', {
            _include: 'id,site_name,deployment_status',
            _sub_field: 'deployment_status',
            ...params
        });

        return Promise.all([sitesWithNamesAndLocations, sitesSummary]).then(([sites, summary]) => {
            const statusesSummaryLookupMap: Record<string, DeploymentStatusesSummary> = {};
            const sitesData: SitesData = {};

            const deploymentsWithSitesSummary = summary.items.filter(item => item.site_name);
            deploymentsWithSitesSummary.forEach(siteSummary => {
                statusesSummaryLookupMap[siteSummary.site_name] = getDeploymentStatusesSummary(siteSummary);
            });

            const sitesWithLocation = sites.items.filter(site => isFinite(site.latitude) && isFinite(site.longitude));
            sitesWithLocation.forEach(site => {
                sitesData[site.name] = {
                    ...site,
                    statusesSummary: statusesSummaryLookupMap[site.name] || emptyDeploymentStatusesSummary
                };
            });

            return { sitesData, sitesAreDefined: sites.items.length > 0 };
        });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const formattedData = data || { sitesData: {}, sitesAreDefined: false };
        return (
            <SitesMap
                data={formattedData.sitesData}
                dimensions={Stage.Common.Map.getWidgetDimensions(widget)}
                showAllLabels={widget.configuration.showAllLabels}
                sitesAreDefined={formattedData.sitesAreDefined}
                toolbox={toolbox}
            />
        );
    }
});
