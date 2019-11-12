/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux';
import Services from '../components/Services';
import { getStatus } from '../actions/status';

const mapStateToProps = state => {
    return {
        services: state.manager.status.services,
        isFetching: state.manager.status.isFetching,
        fetchingError: state.manager.status.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStatusRefresh: () => {
            dispatch(getStatus());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Services);
