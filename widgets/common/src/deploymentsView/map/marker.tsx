import type { FunctionComponent } from 'react';

import { Deployment, DeploymentStatus } from '../types';
import type { DeploymentSitePair } from './common';

const deploymentStatusToIconColorMapping: Record<DeploymentStatus, Stage.Common.MarkerIconColor> = {
    [DeploymentStatus.Good]: 'blue',
    [DeploymentStatus.InProgress]: 'yellow',
    [DeploymentStatus.RequiresAttention]: 'red'
};

const DeploymentSiteMarker: FunctionComponent<DeploymentSitePair & { selected: boolean }> = ({
    deployment,
    site,
    selected
}) => {
    const { FeatureGroup, CircleMarker } = Stage.Basic.Leaflet;
    const position = Stage.Common.Map.siteToLatLng(site);
    const popup = <DeploymentSitePopup deployment={deployment} />;

    // TODO:
    // 1. Change the popup into a tooltip
    // 3. Change the selected deployment when clicking a marker

    if (selected) {
        return (
            <FeatureGroup>
                <CircleMarker center={position} radius={10} color="black" fillOpacity={0.5} />
                {popup}

                <BareDeploymentSiteMarker status={deployment.deployment_status} position={position} />
            </FeatureGroup>
        );
    }

    return (
        <BareDeploymentSiteMarker status={deployment.deployment_status} position={position}>
            {popup}
        </BareDeploymentSiteMarker>
    );
};
export default DeploymentSiteMarker;

const BareDeploymentSiteMarker: FunctionComponent<{ status: DeploymentStatus; position: [number, number] }> = ({
    status,
    position,
    children
}) => {
    const { Marker } = Stage.Basic.Leaflet;
    const icon = Stage.Common.createMarkerIcon(deploymentStatusToIconColorMapping[status]);

    return (
        <Marker icon={icon} position={position} riseOnHover>
            {children}
        </Marker>
    );
};

const DeploymentSitePopup: FunctionComponent<{ deployment: Deployment }> = ({ deployment }) => {
    const { Popup } = Stage.Basic.Leaflet;

    // TODO(RD-1526): add more information in marker popups
    return <Popup>{deployment.id}</Popup>;
};
