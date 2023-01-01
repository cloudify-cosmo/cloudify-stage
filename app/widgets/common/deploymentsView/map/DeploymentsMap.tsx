import type { FunctionComponent } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import type { Dictionary } from 'lodash';
import { keyBy, partition } from 'lodash';
import type { Map } from 'react-leaflet';
import DefaultTileLayer from '../../map/DefaultTileLayer';
import { getMapOptions } from '../../map/options';
import type { Site, SiteWithPosition } from '../../map/site';
import { isSiteWithPosition } from '../../map/site';
import type { WidgetDimensions } from '../../map/widget-dimensions';
import { invalidateSizeAfterDimensionsChange } from '../../map/widget-dimensions';

import type { Deployment } from '../types';
import type { DeploymentSitePair } from './common';
import { DeploymentMarkerClusterGroup, DeploymentSiteMarker } from './marker';
import { selectDeployment } from '../common';
import { Leaflet } from '../../../../components/basic';

interface DeploymentsMapProps {
    deployments: Deployment[];
    selectedDeployment: Deployment | undefined;
    sites: Site[];
    widgetDimensions: WidgetDimensions;
    toolbox: Stage.Types.Toolbox;
    environmentTypeVisible: boolean;
}

const DeploymentsMap: FunctionComponent<DeploymentsMapProps> = ({
    deployments,
    sites,
    widgetDimensions,
    selectedDeployment,
    toolbox,
    environmentTypeVisible
}) => {
    const sitesWithPositions = useMemo(() => sites.filter(isSiteWithPosition), [sites]);
    const sitesLookupTable = useMemo(() => keyBy(sitesWithPositions, 'name'), [sitesWithPositions]);
    const deploymentSitePairs = useMemo(
        () => getDeploymentSitePairs(sitesLookupTable, deployments),
        [sitesLookupTable, deployments]
    );

    // NOTE: selected deployment site pairs should not be clustered
    const [selectedDeploymentSitePairs, notSelectedDeploymentSitePairs] = useMemo(
        () => partition(deploymentSitePairs, ({ deployment }) => deployment.id === selectedDeployment?.id),
        [deploymentSitePairs, selectedDeployment?.id]
    );

    const mapRef = useRef<Map>(null);

    useEffect(
        () => invalidateSizeAfterDimensionsChange(mapRef),
        [widgetDimensions.height, widgetDimensions.width, widgetDimensions.maximized]
    );

    const sitesDisplayed = useMemo(() => deploymentSitePairs.map(({ site }) => site), [deploymentSitePairs]);

    // TODO(RD-2135): auto-pan the map when the selectedDeployment changes

    // NOTE: those options are only relevant during the initial render, since the MapComponent
    // does not declare them as mutable. Thus, no need to recalculate them.
    // See https://react-leaflet.js.org/docs/api-map
    const { options, bounds } = useMemo(() => getMapOptions(sitesDisplayed), []);
    const { Map: MapComponent } = Leaflet;

    function renderDeploymentSiteMarker({ deployment, site }: DeploymentSitePair) {
        return (
            <DeploymentSiteMarker
                deployment={deployment}
                site={site}
                key={`${deployment.id}\n${site.name}`}
                selected={deployment.id === selectedDeployment?.id}
                onClick={() => selectDeployment(toolbox, deployment.id)}
                environmentTypeVisible={environmentTypeVisible}
            />
        );
    }

    return (
        <MapComponent
            bounds={bounds}
            center={options.center}
            zoom={options.zoom}
            ref={mapRef}
            style={{ height: '100%' }}
        >
            <DefaultTileLayer />
            <DeploymentMarkerClusterGroup deploymentSitePairs={deploymentSitePairs}>
                {notSelectedDeploymentSitePairs.map(renderDeploymentSiteMarker)}
            </DeploymentMarkerClusterGroup>

            {selectedDeploymentSitePairs.map(renderDeploymentSiteMarker)}
        </MapComponent>
    );
};
export default DeploymentsMap;

const getDeploymentSitePairs = (
    sitesLookupTable: Dictionary<SiteWithPosition>,
    deployments: Deployment[]
): DeploymentSitePair[] =>
    deployments
        .map((deployment): DeploymentSitePair => ({ deployment, site: sitesLookupTable[deployment.site_name] }))
        // NOTE: additional filtering, since the site may not have a position, and thus not be in the lookup table
        .filter(({ site }) => !!site);
