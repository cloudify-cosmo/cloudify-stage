import { isEmpty, get } from 'lodash';
import SitesTable from './SitesTable';
import './widget.css';
import type { SitesWidget } from './widgets.types';
import { widgetId } from './widget.consts';
import { translateWidget } from './widget.utils';

Stage.defineWidget<never, SitesWidget.Data, SitesWidget.Configuration>({
    id: widgetId,
    name: translateWidget('name'),
    description: translateWidget('description'),
    initialWidth: 5,
    initialHeight: 16,
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

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!data || isEmpty(data)) {
            return <Loading />;
        }

        const { sites, siteDeploymentCount } = data;
        const deploymentsPerSite: Record<string, number> = {};

        siteDeploymentCount.items.forEach(item => {
            if (item.site_name) {
                deploymentsPerSite[item.site_name] = item.deployments;
            }
        });

        const formattedData = {
            items: sites.items.map(site => {
                return {
                    ...site,
                    created_at: Stage.Utils.Time.formatTimestamp(site.created_at),
                    deploymentCount: deploymentsPerSite[site.name] || 0
                };
            }),
            total: get(sites, 'metadata.pagination.total', 0)
        };

        return <SitesTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
