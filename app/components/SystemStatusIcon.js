import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from './basic/index';
import Consts from '../utils/consts';

export default function SystemStatusIcon({ systemStatus, maintenanceStatus }) {
    let color = 'grey';
    if (systemStatus === Consts.SYSTEM_STATUS_FAIL) {
        color = 'red';
    } else if (maintenanceStatus !== Consts.MAINTENANCE_DEACTIVATED) {
        color = 'yellow';
    } else if (systemStatus === Consts.SYSTEM_STATUS_OK) {
        color = 'green';
    }

    return <Icon name="heartbeat" size="large" color={color} className="statusIcon" />;
}
SystemStatusIcon.propTypes = {
    systemStatus: PropTypes.string,
    maintenanceStatus: PropTypes.string
};
SystemStatusIcon.defaultProps = {
    systemStatus: '',
    maintenanceStatus: ''
};
