import React from 'react';
import type { FunctionComponent } from 'react';
import type { SemanticCOLORS } from 'semantic-ui-react';

import { Icon } from '../../basic';
import { clusterServiceStatusEnum } from './consts';
import type { ClusterStatus } from './types';

interface ClusterStatusIconProps {
    status: ClusterStatus | '';
}
const ClusterStatusIcon: FunctionComponent<ClusterStatusIconProps> = ({ status = '' }) => {
    let color: SemanticCOLORS = 'grey';
    if (status === clusterServiceStatusEnum.Fail) {
        color = 'red';
    } else if (status === clusterServiceStatusEnum.Degraded) {
        color = 'yellow';
    } else if (status === clusterServiceStatusEnum.OK) {
        color = 'green';
    }

    return <Icon name="heartbeat" size="large" color={color} className="statusIcon" />;
};
export default ClusterStatusIcon;
