import React from 'react';
import type { FunctionComponent } from 'react';

import NodeServices from './NodeServices';
import { clusterNodeStatusEnum } from './consts';
import { Icon, Popup } from '../../../basic';
import type { NodeServicesProps } from './NodeServices';
import type { ClusterNodeStatus } from './types';

interface NodeStatusProps extends NodeServicesProps {
    status: ClusterNodeStatus;
}

const NodeStatus: FunctionComponent<NodeStatusProps> = ({ name, type, status, services = {} }) => {
    const icon = {
        [clusterNodeStatusEnum.OK]: <Icon name="checkmark" color="green" link />,
        [clusterNodeStatusEnum.Fail]: <Icon name="remove" color="red" link />
    }[status];

    return (
        <Popup hoverable trigger={icon} position="right center">
            <div style={{ maxHeight: '80vh' }}>
                <NodeServices name={name} type={type} services={services} />
            </div>
        </Popup>
    );
};
export default NodeStatus;
