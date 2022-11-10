// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { connect } from 'react-redux';
import { ClusterServiceStatus } from '../../components/shared/cluster/types';
import SystemStatusIcon from '../../components/status/SystemStatusIcon';

const mapStateToProps = state => {
    const systemStatus = _.get(state.manager, 'clusterStatus.status');
    return {
        systemStatus: systemStatus,
        maintenanceStatus: _.get(state.manager, 'maintenance')
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusIcon);
