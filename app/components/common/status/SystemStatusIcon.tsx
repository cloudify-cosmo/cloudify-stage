import React from 'react';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../reducers';
import ClusterStatusIcon from './cluster/ClusterStatusIcon';

export default function SystemStatusIcon() {
    const systemStatus = useSelector((state: ReduxState) => state.manager.clusterStatus.status);
    return <ClusterStatusIcon status={systemStatus} />;
}
