// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { connect } from 'react-redux';
import SystemStatusHeader from '../../components/status/SystemStatusHeader';
import { getClusterStatus } from '../../actions/manager/clusterStatus';

const mapStateToProps = state => {
    return {
        isFetching: _.get(state.manager, 'clusterStatus.isFetching'),
        fetchingError: _.get(state.manager, 'clusterStatus.error')
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStatusRefresh: e => {
            e.stopPropagation();
            dispatch(getClusterStatus());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusHeader);
