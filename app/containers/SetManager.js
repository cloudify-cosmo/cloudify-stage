/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import {setManager} from '../actions/managers';
import SetManager from '../components/SetManager';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        name: !state.managers.items || state.managers.items.length === 0 ? '' : state.managers.items[0].name,
        ip:   !state.managers.items || state.managers.items.length === 0 ? '' : state.managers.items[0].ip
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onManagerSaved: (name,ip)=> {
            dispatch(setManager(name,ip));
            dispatch(push('/'));
        }
    }
};

const SetManagerW = connect(
    mapStateToProps,
    mapDispatchToProps
)(SetManager);


export default SetManagerW
