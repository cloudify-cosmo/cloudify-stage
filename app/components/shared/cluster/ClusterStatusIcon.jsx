import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../../basic';
import { clusterStatusEnum } from './consts';

export default function ClusterStatusIcon({ status }) {
    let color = 'grey';
    if (status === clusterStatusEnum.Fail) {
        color = 'red';
    } else if (status === clusterStatusEnum.Degraded) {
        color = 'yellow';
    } else if (status === clusterStatusEnum.OK) {
        color = 'green';
    }

    return <Icon name="heartbeat" size="large" color={color} className="statusIcon" />;
}
ClusterStatusIcon.propTypes = {
    status: PropTypes.string
};
ClusterStatusIcon.defaultProps = {
    status: ''
};
