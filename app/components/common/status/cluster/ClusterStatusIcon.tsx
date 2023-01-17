import React from 'react';
import type { FunctionComponent } from 'react';
import type { SemanticCOLORS } from 'semantic-ui-react';

import { Icon } from '../../../basic';
import { ClusterServiceStatus } from './types';

interface ClusterStatusIconProps {
    status?: ClusterServiceStatus;
}
const ClusterStatusIcon: FunctionComponent<ClusterStatusIconProps> = ({ status }) => {
    let color: SemanticCOLORS = 'grey';
    if (status === ClusterServiceStatus.Fail) {
        color = 'red';
    } else if (status === ClusterServiceStatus.Degraded) {
        color = 'yellow';
    } else if (status === ClusterServiceStatus.OK) {
        color = 'green';
    }

    return <Icon name="heartbeat" size="large" color={color} className="statusIcon" />;
};
export default ClusterStatusIcon;
