/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import Manager from '../components/Manager'
import {getStatus,getTenants} from '../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchManagerStatus: (manager) => {
            dispatch(getStatus(manager));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Manager);
