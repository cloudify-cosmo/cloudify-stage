/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import {setEditMode} from '../../actions/config';
import Header from '../../components/layout/Header';


const mapStateToProps = (state, ownProps) => {
    return {
        isEditMode: state.config.isEditMode || false,
        manager: state.manager || {}
    }
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetsGridEditModeChange: (isEditMode) => {
            dispatch(setEditMode(isEditMode));
        }
    }
};

const HeaderW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);


export default HeaderW