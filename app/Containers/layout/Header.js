/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import {setDashboardEditMode} from '../../actions/header';
import Header from '../../components/layout/Header';


const mapStateToProps = (state, ownProps) => {
    return {
        isEditMode: state.header.isEditMode || false
    }
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetsGridEditModeChange: (isEditMode) => {
            dispatch(setDashboardEditMode(isEditMode));
        }
    }
};

const HeaderW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);


export default HeaderW