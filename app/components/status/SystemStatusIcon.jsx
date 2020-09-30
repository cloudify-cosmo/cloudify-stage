import React from 'react';
import PropTypes from 'prop-types';

import ClusterStatusIcon from '../shared/cluster/ClusterStatusIcon';

export default function SystemStatusIcon({ systemStatus }) {
    return <ClusterStatusIcon status={systemStatus} />;
}
SystemStatusIcon.propTypes = {
    systemStatus: PropTypes.string
};
SystemStatusIcon.defaultProps = {
    systemStatus: ''
};
