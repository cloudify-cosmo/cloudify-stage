import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'semantic-ui-react';
import { Popup } from 'cloudify-ui-components';
import NodeServices from './NodeServices';
import { clusterNodeStatusEnum, clusterNodeStatuses } from './consts';

export default function NodeStatus({ name, type, status, services }) {
    const icon = {
        [clusterNodeStatusEnum.OK]: <Icon name="checkmark" color="green" link />,
        [clusterNodeStatusEnum.FAIL]: <Icon name="remove" color="red" link />
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
