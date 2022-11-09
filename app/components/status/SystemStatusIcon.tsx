import React from 'react';

import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';
import { ClusterServiceStatus } from '../shared/cluster/types';

interface SystemStatusIconProps {
    systemStatus: keyof typeof ClusterServiceStatus;
}

export default function SystemStatusIcon({ systemStatus = 'Unknown' }: SystemStatusIconProps) {
    return <ClusterStatusIcon status={ClusterServiceStatus[systemStatus]} />;
}
