import type { FunctionComponent } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../basic';
import SideBarItemIcon from './SideBarItemIcon';
import StageUtils from '../../utils/stageUtils';
import { getClusterStatus } from '../../actions/manager/clusterStatus';
import SystemServicesStatus from '../../containers/status/SystemServicesStatus';
import { ClusterServiceStatus } from '../shared/cluster/consts';
import type { ReduxState } from '../../reducers';
import SideBarDropdownItem from './SideBarDropdownItem';

const t = StageUtils.getT('users');

const dotColors = {
    [ClusterServiceStatus.Fail]: 'red',
    [ClusterServiceStatus.Degraded]: 'yellow'
} as const;

const dropdownMenuStyle = { padding: 5 };

const HealthIndicator: FunctionComponent = () => {
    const dispatch = useDispatch();
    const systemStatus = useSelector((state: ReduxState) => state.manager.clusterStatus.status);
    const dotColorIndex =
        systemStatus === ClusterServiceStatus.Degraded ? ClusterServiceStatus.Degraded : ClusterServiceStatus.Fail;
    const dotColor = dotColors[dotColorIndex];

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
