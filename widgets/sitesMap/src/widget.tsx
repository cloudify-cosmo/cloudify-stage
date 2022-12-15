import type { SiteWithPosition } from '../../../app/widgets/common/map/site';
import SitesMap from './SitesMap';
import type { DeploymentStatus, DeploymentStatusesSummary, SitesData } from './types';
import { DeploymentStatuses } from './types';

import './widget.css';
import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

const emptyDeploymentStatusesSummary: DeploymentStatusesSummary = {
    [DeploymentStatuses.Good]: 0,
    [DeploymentStatuses.InProgress]: 0,
    [DeploymentStatuses.RequiresAttention]: 0
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

interface SitesMapWidgetConfiguration extends PollingTimeConfiguration {
    showAllLabels: boolean;
}

Stage.defineWidget<SitesMapWidgetParams, SitesMapWidgetData, SitesMapWidgetConfiguration>({
    id: 'sitesMap',
    name: 'Sites Map',
    description: 'This widget displays a map view of sites by location with site deployments status summary',
    initialWidth: 6,
    initialHeight: 30,
    isReact: true,
    hasReadme: true,
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
        const SummaryActions = Stage.Common.Actions.Summary;
        const DeploymentActions = Stage.Common.Deployments.Actions;
        const sitesWithNamesAndLocations = new DeploymentActions(toolbox.getManager()).doGetSitesNamesAndLocations();

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

            const sitesWithLocation = sites.items.filter(
                site => Number.isFinite(site.latitude) && Number.isFinite(site.longitude)
            ) as SiteWithPosition[];
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

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return (
            <SitesMap
                data={data.sitesData}
                dimensions={Stage.Common.Map.getWidgetDimensions(widget)}
                showAllLabels={widget.configuration.showAllLabels}
                sitesAreDefined={data.sitesAreDefined}
                toolbox={toolbox}
            />
        );
    }
});
