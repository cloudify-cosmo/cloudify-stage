import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Icon } from '../basic';
import SideBarItem from './SideBarItem';
import SideBarItemIcon from './SideBarItemIcon';
import StageUtils from '../../utils/stageUtils';
import { getClusterStatus } from '../../actions/clusterStatus';
import SystemServicesStatus from '../../containers/status/SystemServicesStatus';
import { clusterStatusEnum } from '../shared/cluster/consts';
import { ReduxState } from '../../reducers';

const t = StageUtils.getT('users');

const dotColors = {
    [clusterStatusEnum.Fail]: 'red',
    [clusterStatusEnum.Degraded]: 'yellow'
} as const;

const HealthIndicator: FunctionComponent = () => {
    const dispatch = useDispatch();
    const systemStatus = useSelector((state: ReduxState) => state.manager.clusterStatus.status);
    const dotColor = dotColors[systemStatus];

    const trigger = (
        <SideBarItem>
            <Icon.Group>
                <SideBarItemIcon name="heartbeat" />
                {dotColor && <Icon corner="top right" name="circle" color={dotColor} />}
            </Icon.Group>
            {t('health')}
        </SideBarItem>
    );

    return (
        <Dropdown trigger={trigger} pointing="left" icon={null} fluid onOpen={() => dispatch(getClusterStatus())}>
            <Dropdown.Menu style={{ padding: 5, margin: 0, height: 267 }}>
                <SystemServicesStatus />
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default HealthIndicator;
