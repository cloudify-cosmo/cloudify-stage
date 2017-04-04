/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import {login} from '../actions/managers';
import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var configIp = _.get(state.config,'manager.ip'); // Default Ip via configuration
    var savedIp = state.manager.ip; // Saved ip (user last logged in to this ip)
    var ip = savedIp; // First attempt to use the saved ip
    if (_.isEmpty(ip)) {
        ip = configIp; // If its empty use config ip
    }
    if (_.isEmpty(ip)) {
        ip = window.location.hostname; // If this is empty too, grab the same ip as the UI (installed on manager machine by default)
    }

    return {
        ip:  ip,
        username:  state.manager ? state.manager.username : '',
        isLoggingIn: state.manager.isLoggingIn,
        loginError: state.manager ? state.manager.err : '',
        mode: state.config.mode,
        shouldShowIpField: state.config.mode === Consts.MODE_MAIN && !_.get(state.config, 'app.singleManager',false)
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLogin: (ip,username,password)=> {
            dispatch(login(ip,username,password));
            //dispatch(push('/'));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
