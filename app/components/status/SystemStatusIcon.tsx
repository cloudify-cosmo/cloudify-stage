import React from 'react';

import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';
import type { ClusterStatus } from '../shared/cluster/types';

type SystemStatusIconProps = {
    systemStatus: ClusterStatus | '';
};

export default function SystemStatusIcon({ systemStatus = '' }: SystemStatusIconProps) {
    return <ClusterStatusIcon status={systemStatus} />;
}
