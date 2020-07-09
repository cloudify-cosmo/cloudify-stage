import React from 'react';
import PropTypes from 'prop-types';

import NodeServices from './NodeServices';
import { clusterNodeStatusEnum, clusterNodeStatuses } from './consts';
import { Icon, Popup } from '../../basic';

export default function NodeStatus({ name, type, status, services }) {
    const icon = {
        [clusterNodeStatusEnum.OK]: <Icon name="checkmark" color="green" link />,
        [clusterNodeStatusEnum.Fail]: <Icon name="remove" color="red" link />
    }[status];

    return (
        <Popup hoverable>
            <Popup.Trigger>
                <span>{icon}</span>
            </Popup.Trigger>
            <Popup.Content>
                <NodeServices name={name} type={type} services={services} />
            </Popup.Content>
        </Popup>
    );
}

NodeStatus.propTypes = {
    ...NodeServices.propTypes,
    status: PropTypes.oneOf(clusterNodeStatuses).isRequired
};
NodeStatus.defaultProps = {
    ...NodeServices.defaultProps
};
