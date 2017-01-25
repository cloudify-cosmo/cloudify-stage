/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import {login} from '../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        ip:  state.manager && state.manager.ip ? state.manager.ip : _.get(state.config,'manager.ip',''),
        username:  state.manager ? state.manager.username : '',
        loginError: state.manager ? state.manager.err : '',
        mode: state.config.mode
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
