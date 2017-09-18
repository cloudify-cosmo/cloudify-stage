/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import Layout from '../../components/layout/Layout';

import { connect } from 'react-redux';
import {intialPageLoad} from '../../actions/app';
import {logout} from '../../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.app.loading
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        intialPageLoad: ()=>{
            return dispatch(intialPageLoad());
        },
        doLogout: (err, path)=>{
            return dispatch(logout(err, path));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout);
