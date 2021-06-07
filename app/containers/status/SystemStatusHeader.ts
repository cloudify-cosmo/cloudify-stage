import _ from 'lodash';
import { connect } from 'react-redux';
import SystemStatusHeader from '../../components/status/SystemStatusHeader';
import { getClusterStatus } from '../../actions/clusterStatus';

const mapStateToProps = state => {
    return {
        isFetching: _.get(state.manager, 'clusterStatus.isFetching'),
        fetchingError: _.get(state.manager, 'clusterStatus.error')
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStatusRefresh: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusHeader);
