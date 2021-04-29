import { Dictionary, keyBy } from 'lodash';
import { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import type { Map } from 'react-leaflet';

import { Deployment } from '../types';
import { DeploymentSitePair } from './common';
import DeploymentSiteMarker from './marker';
import { selectDeployment } from '../common';

interface DeploymentsMapProps {
    deployments: Deployment[];
    selectedDeployment: Deployment | undefined;
    sites: Stage.Common.Map.Site[];
    widgetDimensions: Stage.Common.Map.WidgetDimensions;
    toolbox: Stage.Types.Toolbox;
}

const DeploymentsMap: FunctionComponent<DeploymentsMapProps> = ({
    deployments,
    sites,
    widgetDimensions,
    selectedDeployment,
    toolbox
}) => {
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

    const sitesDisplayed = useMemo(() => deploymentSitePairs.map(({ site }) => site), [deploymentSitePairs]);

    // TODO(RD-2135): auto-pan the map when the selectedDeployment changes

    // NOTE: those options are only relevant during the initial render, since the MapComponent
    // does not declare them as mutable. Thus, no need to recalculate them.
    // See https://react-leaflet.js.org/docs/api-map
    const { options, bounds } = useMemo(() => Stage.Common.Map.getMapOptions(sitesDisplayed), []);
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
                <DeploymentSiteMarker
                    deployment={deployment}
                    site={site}
                    key={`${deployment.id}\n${site.name}`}
                    selected={deployment.id === selectedDeployment?.id}
                    onClick={() => selectDeployment(toolbox, deployment.id)}
                />
            ))}
        </MapComponent>
    );
};
export default DeploymentsMap;

const getDeploymentSitePairs = (
    sitesLookupTable: Dictionary<Stage.Common.Map.SiteWithPosition>,
    deployments: Deployment[]
): DeploymentSitePair[] =>
    deployments
        .map((deployment): DeploymentSitePair => ({ deployment, site: sitesLookupTable[deployment.site_name] }))
        // NOTE: additional filtering, since the site may not have a position, and thus not be in the lookup table
        .filter(({ site }) => !!site);
