import _ from 'lodash';
import { connect } from 'react-redux';
import SystemStatusIcon from '../../components/status/SystemStatusIcon';
import type { ReduxState } from '../../reducers';

const mapStateToProps = (state: { manager: ReduxState['manager'] }) => {
    const systemStatus = _.get(state.manager, 'clusterStatus.status');
    return {
        systemStatus,
        maintenanceStatus: _.get(state.manager, 'maintenance')
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusIcon);
