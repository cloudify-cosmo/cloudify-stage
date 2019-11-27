/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux';
import SystemServicesStatus from '../../components/status/SystemServicesStatus';
import { getClusterStatus } from '../../actions/clusterStatus';

const mapStateToProps = state => {
    return {
        services: state.manager.clusterStatus.services,
        isFetching: state.manager.clusterStatus.isFetching,
        fetchingError: state.manager.clusterStatus.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStatusRefresh: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemServicesStatus);
