import _ from 'lodash';
import { connect } from 'react-redux';
import SystemStatusIcon from '../../components/status/SystemStatusIcon';
import type { ReduxState } from '../../reducers';

const mapStateToProps = (state: ReduxState) => {
    const systemStatus = state.manager.clusterStatus.status;
    return {
        systemStatus,
        maintenanceStatus: state.manager.maintenance
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusIcon);
