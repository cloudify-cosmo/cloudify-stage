/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import {clearContext,setValue} from '../actions/context';
import { push } from 'react-router-redux';
import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var selectedPageId = ownProps.params.pageId || "0";
    var pages = state.pages;

    return {
        selectedPage : _.find(pages,{id:selectedPageId}),
        pageId: selectedPageId,
        contextParams: ownProps.location.query,
        isMaintenance : state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClearContext: ()=>{
            dispatch(clearContext());
        },
        onSetContextValue: (key,value)=>{
            dispatch(setValue(key,value));
        },
        navigateTo404: () =>{
            dispatch(push('/404'));
        },
        navigateToMaintenancePage: () =>{
            dispatch(push('/maintenance'));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
