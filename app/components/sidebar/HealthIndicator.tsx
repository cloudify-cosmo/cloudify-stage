import type { FunctionComponent } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../basic';
import SideBarItemIcon from './SideBarItemIcon';
import StageUtils from '../../utils/stageUtils';
import { getClusterStatus } from '../../actions/manager/clusterStatus';
import SystemServicesStatus from '../../containers/status/SystemServicesStatus';
import { ClusterServiceStatus } from '../shared/cluster/types';
import type { ReduxState } from '../../reducers';
import SideBarDropdownItem from './SideBarDropdownItem';

const t = StageUtils.getT('users');

const statusToDotColor = (systemStatus: keyof typeof ClusterServiceStatus | undefined) => {
    const dotColors = {
        [ClusterServiceStatus.Fail]: 'red',
        [ClusterServiceStatus.Degraded]: 'yellow'
    } as const;

    if (!systemStatus) {
        return dotColors[ClusterServiceStatus.Fail];
    }

    const clusterServiceStatus = ClusterServiceStatus[systemStatus];
    if (clusterServiceStatus === ClusterServiceStatus.Degraded || clusterServiceStatus === ClusterServiceStatus.Fail) {
        return dotColors[clusterServiceStatus];
    }

    return undefined;
};

const dropdownMenuStyle = { padding: 5 };

const HealthIndicator: FunctionComponent = () => {
    const dispatch = useDispatch();
    const systemStatus: keyof typeof ClusterServiceStatus | undefined = useSelector(
        (state: ReduxState) => state.manager.clusterStatus.status
    );

    const dotColor = statusToDotColor(systemStatus);

    return (
        <SideBarDropdownItem
            icon={
                <Icon.Group>
                    <SideBarItemIcon name="heartbeat" />
                    {dotColor && <Icon corner="top right" name="circle" color={dotColor} style={{ marginRight: 8 }} />}
                </Icon.Group>
            }
            label={t('health')}
            onOpen={() => dispatch(getClusterStatus())}
            style={dropdownMenuStyle}
        >
            <SystemServicesStatus />
        </SideBarDropdownItem>
    );
};

export default HealthIndicator;
