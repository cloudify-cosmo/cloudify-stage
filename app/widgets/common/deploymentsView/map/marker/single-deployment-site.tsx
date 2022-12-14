import type { FunctionComponent, RefObject } from 'react';
import React, { useEffect, useRef } from 'react';
import { siteToLatLng } from '../../../map/site';
import type { MarkerIconColor } from '../../../map/MarkerIcon';
import { createMarkerIcon } from '../../../map/MarkerIcon';

import { DeploymentStatus } from '../../types';
import type { DeploymentSitePair } from '../common';
import DeploymentSiteTooltip from './tooltip';
import { Leaflet } from '../../../../../components/basic';

const deploymentStatusToIconColorMapping: Record<DeploymentStatus, MarkerIconColor> = {
    [DeploymentStatus.Good]: 'blue',
    [DeploymentStatus.InProgress]: 'yellow',
    [DeploymentStatus.RequiresAttention]: 'red'
};

type DeploymentSiteMarkerProps = DeploymentSitePair & {
    selected: boolean;
    onClick: () => void;
    environmentTypeVisible: boolean;
};

const DeploymentSiteMarker: FunctionComponent<DeploymentSiteMarkerProps> = ({
    deployment,
    site,
    selected,
    onClick,
    environmentTypeVisible
}) => {
    const { FeatureGroup, CircleMarker } = Leaflet;
    /**
     * The `position` object must maintain the same reference. Otherwise, if it is a new reference,
     * the markercluster library will assume that the marker has moved and will recreate the clusters,
     * resulting in unnecessary UI operations and losing UI state (e.g. whether the cluster marker is spiderfied).
     *
     * @see https://github.com/Leaflet/Leaflet.markercluster/blob/499f71caa1fe8a4efcf91b85e42553f9a90306f1/src/MarkerClusterGroup.js#L715-L721
     * @see https://github.com/PaulLeCam/react-leaflet/blob/d9f18e527495105bab1df65a8829422514daefd7/src/Marker.js#L27-L29
     */
    const position = siteToLatLng(site);
    const tooltip = <DeploymentSiteTooltip deployment={deployment} environmentTypeVisible={environmentTypeVisible} />;

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

export type DeploymentMarkerWithStatus = import('leaflet').Marker & { status: DeploymentStatus };

const BareDeploymentSiteMarker: FunctionComponent<{
    status: DeploymentStatus;
    position: [number, number];
    onClick?: () => void;
}> = ({ status, position, children, onClick }) => {
    const { Marker } = Leaflet;
    const icon = createMarkerIcon(deploymentStatusToIconColorMapping[status]);
    const markerRef =
        useRef<import('react-leaflet').Marker<import('react-leaflet').MarkerProps, DeploymentMarkerWithStatus>>();

    useEffect(() => {
        if (!markerRef.current) {
            return;
        }

        markerRef.current.leafletElement.status = status;
    }, [status]);

    return (
        <Marker
            icon={icon}
            position={position}
            riseOnHover
            onclick={onClick}
            // NOTE: TS does not like the additional `status` marker property
            ref={markerRef as RefObject<import('react-leaflet').Marker>}
        >
            {children}
        </Marker>
    );
};
