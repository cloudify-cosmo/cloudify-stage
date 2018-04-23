/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import React from 'react';
import Routes from '../components/Routes';

import { connect } from 'react-redux';
import Consts from '../utils/consts';
import Auth from '../utils/auth';

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: Auth.isLoggedIn(),
        isInMaintenanceMode: state.manager && state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Routes);
