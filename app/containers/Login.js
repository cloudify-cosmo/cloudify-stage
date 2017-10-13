/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import {login} from '../actions/managers';
import Consts from '../utils/consts';

const mapStateToProps = (state) => {

    return {
        username:  state.manager ? state.manager.username : '',
        isLoggingIn: state.manager.isLoggingIn,
        loginError: state.manager ? state.manager.err : '',
        mode: state.config.mode,
        whiteLabel : state.config.app.whiteLabel
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLogin: (username, password, redirect)=> {
            dispatch(login(username, password, redirect));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
