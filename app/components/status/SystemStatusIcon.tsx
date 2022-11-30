import React from 'react';

import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';
import type { ClusterServiceStatus } from '../shared/cluster/types';

export interface SystemStatusIconProps {
    systemStatus?: ClusterServiceStatus;
}

export default function SystemStatusIcon({ systemStatus }: SystemStatusIconProps) {
    return <ClusterStatusIcon status={systemStatus} />;
}
