import React from 'react';
import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';
import type { ClusterStatusIconProps } from '../shared/cluster/ClusterStatusIcon';

type SystemStatusIconProps = {
    systemStatus: ClusterStatusIconProps['status'];
};

export default function SystemStatusIcon({ systemStatus = '' }: SystemStatusIconProps) {
    return <ClusterStatusIcon status={systemStatus} />;
}
