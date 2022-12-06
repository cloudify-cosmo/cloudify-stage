import React from 'react';
import { connect } from 'react-redux';
import type { ReduxState } from '../../reducers';

import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';
import type { ClusterServiceStatus } from '../shared/cluster/types';

export interface SystemStatusIconProps {
    systemStatus?: ClusterServiceStatus;
}

function SystemStatusIcon({ systemStatus }: SystemStatusIconProps) {
    return <ClusterStatusIcon status={systemStatus} />;
}
const mapStateToProps = (state: ReduxState) => {
    const systemStatus = state.manager.clusterStatus.status;
    return {
        systemStatus,
        maintenanceStatus: state.manager.maintenance
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusIcon);
