import { FunctionComponent, useEffect, useRef } from 'react';
import { countBy, kebabCase } from 'lodash';
import styled from 'styled-components';

/**
 * NOTE: make sure to use `import type` for leaflet. Otherwise, all hell breaks loose
 * (leaflet is included twice which breaks references for `instanceof` checks)
 */
import type { MarkerCluster, MarkerClusterGroupOptions } from 'leaflet';

import type { DeploymentSitePair } from '../common';
import { DeploymentStatus } from '../../types';
import type { DeploymentMarkerWithStatus } from './single-deployment-site';

interface DeploymentMarkerClusterGroupProps {
    deploymentSitePairs: DeploymentSitePair[];
}
const DeploymentMarkerClusterGroup: FunctionComponent<DeploymentMarkerClusterGroupProps> = ({
    children,
    deploymentSitePairs
}) => {
    const { MarkerClusterGroup } = Stage.Basic.Leaflet;
    const markerClusterGroupRef = useSelfRefreshingMarkerClusterGroupRef(deploymentSitePairs);

    return (
        <MarkerClusterGroup iconCreateFunction={createClusterIcon} ref={markerClusterGroupRef}>
            {children}
        </MarkerClusterGroup>
    );
};
export default DeploymentMarkerClusterGroup;

function useSelfRefreshingMarkerClusterGroupRef(deploymentSitePairs: DeploymentSitePair[]) {
    type MarkerClusterGroupComponent = InstanceType<typeof import('react-leaflet-markercluster').default>;
    const markerClusterGroupRef = useRef<MarkerClusterGroupComponent>(null);

    useEffect(() => {
        if (deploymentSitePairs.length === 0) {
            return;
        }

        // NOTE: necessary to update cluster marker icons
        (markerClusterGroupRef.current?.leafletElement as
            | import('leaflet').MarkerClusterGroup
            | undefined)?.refreshClusters?.();
    }, [deploymentSitePairs]);

    return markerClusterGroupRef;
}

function getClusterIconContainer() {
    const newIcon = document.createElement('div');
    // NOTE: necessary to maintain the dimensions of the icon
    newIcon.style.width = '100%';
    newIcon.style.height = '100%';
    return newIcon;
}
const memoizedGetClusterIconContainer = Stage.Utils.memoizeWithWeakMap(getClusterIconContainer);

const createClusterIcon: MarkerClusterGroupOptions['iconCreateFunction'] = cluster => {
    // TODO(RD-2305): add cluster tooltip (`cluster.bindTooltip`)
    const icon = memoizedGetClusterIconContainer(cluster);
    ReactDOM.render(<ClusterMarkerIcon cluster={cluster} />, icon);

    const iconSize = 40; // px
    return window.L.divIcon({
        html: icon,
        iconSize: [iconSize, iconSize],
        // NOTE: disables the default icon styles
        className: ''
    });
};

const ClusterMarkerIconCircle = styled.div<{ status: DeploymentStatus }>`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--deployment-status-color-${({ status }) => kebabCase(status)});
    color: var(--deployment-status-foreground-color-${({ status }) => kebabCase(status)});
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px rgba(0, 0, 0, 0.6);
`;

type DeploymentStatusCounts = Partial<Record<DeploymentStatus, number>>;
const worstToBestDeploymentStatuses = [
    DeploymentStatus.RequiresAttention,
    DeploymentStatus.InProgress,
    DeploymentStatus.Good
];
const getAggregatedClusterStatus = (statusCounts: DeploymentStatusCounts): DeploymentStatus => {
    const aggregatedStatus = worstToBestDeploymentStatuses.find(status => statusCounts[status]! > 0);
    if (!aggregatedStatus) {
        throw new Error("Cannot determine the cluster's aggregated status when there are no deployments inside");
    }

    return aggregatedStatus;
};

const ClusterMarkerIcon: FunctionComponent<{ cluster: MarkerCluster }> = ({ cluster }) => {
    const statusCounts = countBy(
        cluster.getAllChildMarkers() as DeploymentMarkerWithStatus[],
        'status'
    ) as DeploymentStatusCounts;

    return (
        <ClusterMarkerIconCircle status={getAggregatedClusterStatus(statusCounts)}>
            {cluster.getChildCount()}
        </ClusterMarkerIconCircle>
    );
};
