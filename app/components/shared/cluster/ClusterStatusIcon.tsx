import React from 'react';
import type { FunctionComponent } from 'react';
import type { SemanticCOLORS } from 'semantic-ui-react';

import { Icon } from '../../basic';
import { ClusterServiceStatus } from './types';

interface ClusterStatusIconProps {
    status: keyof typeof ClusterServiceStatus;
}
const ClusterStatusIcon: FunctionComponent<ClusterStatusIconProps> = ({ status }) => {
    const clusterServiceStatus = ClusterServiceStatus[status];
    let color: SemanticCOLORS = 'grey';
    if (clusterServiceStatus === ClusterServiceStatus.Fail) {
        color = 'red';
    } else if (clusterServiceStatus === ClusterServiceStatus.Degraded) {
        color = 'yellow';
    } else if (clusterServiceStatus === ClusterServiceStatus.OK) {
        color = 'green';
    }

    return <Icon name="heartbeat" size="large" color={color} className="statusIcon" />;
};
export default ClusterStatusIcon;
