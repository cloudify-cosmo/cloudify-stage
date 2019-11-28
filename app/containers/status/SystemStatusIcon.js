import { connect } from 'react-redux';
import SystemStatusIcon from '../../components/status/SystemStatusIcon';

const mapStateToProps = state => {
    return {
        systemStatus: _.get(state.manager, 'clusterStatus.status'),
        maintenanceStatus: _.get(state.manager, 'maintenance')
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemStatusIcon);
