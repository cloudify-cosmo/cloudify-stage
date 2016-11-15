/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';
import {login} from '../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        ip:  !state.managers.items || state.managers.items.length === 0 ? '' : state.managers.items[0].ip,
        username:  !state.managers.items || state.managers.items.length === 0 ? '' : state.managers.items[0].username,
        loginError: !state.managers.items || state.managers.items.length === 0 ? '' : state.managers.items[0].err
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
