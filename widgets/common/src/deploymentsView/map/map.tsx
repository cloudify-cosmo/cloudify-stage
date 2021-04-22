import { Dictionary, keyBy } from 'lodash';
import { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import type { Map } from 'react-leaflet';

import { Deployment, DeploymentStatus } from '../types';

interface DeploymentsMapProps {
    deployments: Deployment[];
    sites: Stage.Common.Map.Site[];
    widgetDimensions: Stage.Common.Map.WidgetDimensions;
}

const DeploymentsMap: FunctionComponent<DeploymentsMapProps> = ({ deployments, sites, widgetDimensions }) => {
    const sitesWithPositions = useMemo(() => sites.filter(Stage.Common.Map.isSiteWithPosition), [sites]);
    const sitesLookupTable = useMemo(() => keyBy(sitesWithPositions, 'name'), [sitesWithPositions]);
    const deploymentSitePairs = useMemo(() => getDeploymentSitePairs(sitesLookupTable, deployments), [
        sitesLookupTable,
        deployments
    ]);

    const mapRef = useRef<Map | null>(null);

    useEffect(() => Stage.Common.Map.invalidateSizeAfterDimensionsChange(mapRef), [
        widgetDimensions.height,
        widgetDimensions.width,
        widgetDimensions.maximized
    ]);

    // TODO: Create markers and display the map
    const { options, bounds } = Stage.Common.Map.getMapOptions(sitesWithPositions);
    const { Map: MapComponent } = Stage.Basic.Leaflet;
    const { DefaultTileLayer } = Stage.Common.Map;

    return (
        <MapComponent
            bounds={bounds}
            center={options.center}
            zoom={options.zoom}
            ref={mapRef}
            style={{ height: '100%' }}
        >
            <DefaultTileLayer />
            {deploymentSitePairs.map(({ deployment, site }) => (
                <DeploymentSiteMarker deployment={deployment} site={site} key={`${deployment.id}-${site.name}`} />
            ))}
        </MapComponent>
    );
};
export default DeploymentsMap;

interface DeploymentSitePair {
    deployment: Deployment;
    site: Stage.Common.Map.SiteWithPosition;
}

const getDeploymentSitePairs = (
    sitesLookupTable: Dictionary<Stage.Common.Map.SiteWithPosition>,
    deployments: Deployment[]
): DeploymentSitePair[] =>
    deployments
        .map((deployment): DeploymentSitePair => ({ deployment, site: sitesLookupTable[deployment.site_name] }))
        // NOTE: additional filtering, since the site may not have a position, and thus not be in the lookup table
        .filter(({ site }) => !!site);

const deploymentStatusToIconColorMapping: Record<DeploymentStatus, Stage.Common.MarkerIconColor> = {
    [DeploymentStatus.Good]: 'blue',
    [DeploymentStatus.InProgress]: 'yellow',
    [DeploymentStatus.RequiresAttention]: 'red'
};
const DeploymentSiteMarker: FunctionComponent<DeploymentSitePair> = ({ deployment, site }) => {
    const icon = Stage.Common.createMarkerIcon(deploymentStatusToIconColorMapping[deployment.deployment_status]);
    const { Marker, Popup } = Stage.Basic.Leaflet;

    return (
        <Marker icon={icon} position={Stage.Common.Map.siteToLatLng(site)}>
            {/* TODO(RD-1526): add more information in marker popups */}
            <Popup>{deployment.id}</Popup>
        </Marker>
    );
};
