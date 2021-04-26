import type { FunctionComponent } from 'react';

import { Deployment, DeploymentStatus } from '../types';
import type { DeploymentSitePair } from './common';

const deploymentStatusToIconColorMapping: Record<DeploymentStatus, Stage.Common.MarkerIconColor> = {
    [DeploymentStatus.Good]: 'blue',
    [DeploymentStatus.InProgress]: 'yellow',
    [DeploymentStatus.RequiresAttention]: 'red'
};

type DeploymentSiteMarkerProps = DeploymentSitePair & { selected: boolean; onClick: () => void };

const DeploymentSiteMarker: FunctionComponent<DeploymentSiteMarkerProps> = ({
    deployment,
    site,
    selected,
    onClick
}) => {
    const { FeatureGroup, CircleMarker } = Stage.Basic.Leaflet;
    const position = Stage.Common.Map.siteToLatLng(site);
    const tooltip = <DeploymentSiteTooltip deployment={deployment} />;

    if (selected) {
        // NOTE: only render FeatureGroup when necessary to avoid adding additional Leaflet elements
        return (
            <FeatureGroup onclick={onClick}>
                <CircleMarker
                    center={position}
                    radius={10}
                    color="black"
                    fillOpacity={0.5}
                    // NOTE: data-testid has no effect, so using className to target the element in tests
                    className="test__map-selected-marker"
                />
                {tooltip}

                <BareDeploymentSiteMarker status={deployment.deployment_status} position={position} />
            </FeatureGroup>
        );
    }

    return (
        <BareDeploymentSiteMarker status={deployment.deployment_status} position={position} onClick={onClick}>
            {tooltip}
        </BareDeploymentSiteMarker>
    );
};
export default DeploymentSiteMarker;

const BareDeploymentSiteMarker: FunctionComponent<{
    status: DeploymentStatus;
    position: [number, number];
    onClick?: () => void;
}> = ({ status, position, children, onClick }) => {
    const { Marker } = Stage.Basic.Leaflet;
    const icon = Stage.Common.createMarkerIcon(deploymentStatusToIconColorMapping[status]);

    return (
        <Marker icon={icon} position={position} riseOnHover onclick={onClick}>
            {children}
        </Marker>
    );
};

const tooltipOffset = L.point(0, -40);
const DeploymentSiteTooltip: FunctionComponent<{ deployment: Deployment }> = ({ deployment }) => {
    const { Tooltip } = Stage.Basic.Leaflet;

    // TODO(RD-1526): add more information in marker tooltips
    return (
        <Tooltip direction="top" offset={tooltipOffset}>
            {deployment.id}
        </Tooltip>
    );
};
