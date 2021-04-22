import { Dictionary, keyBy } from 'lodash';
import { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import type { Map } from 'react-leaflet';

import type { Deployment } from '../types';

type Site = Stage.Common.Map.Site;

interface DeploymentsMapProps {
    deployments: Deployment[];
    sites: Site[];
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
        </MapComponent>
    );
};
export default DeploymentsMap;

interface DeploymentSitePair {
    deployment: Deployment;
    site: Site;
}

const getDeploymentSitePairs = (sitesLookupTable: Dictionary<Site>, deployments: Deployment[]): DeploymentSitePair[] =>
    deployments.map((deployment): DeploymentSitePair => ({ deployment, site: sitesLookupTable[deployment.site_name] }));
