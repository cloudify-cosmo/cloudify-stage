/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import {setAppError} from '../actions/app';
import {clearContext,setValue} from '../actions/context';
import {setDrilldownContext} from '../actions/drilldownContext';
import {storeCurrentPageId} from '../actions/app';
import { push } from 'react-router-redux';
import Consts from '../utils/consts';
import { parse } from 'query-string';

const mapStateToProps = (state, ownProps) => {
    var pages = state.pages;
    var homePageId = _.isEmpty(pages)?'':pages[0].id;
    var selectedPageId = ownProps.match.params.pageId || homePageId;
    var selectedPageName = ownProps.match.params.pageName || '';

    var query = parse(ownProps.location.search);
    var context = query.c ? JSON.parse(query.c) : [];

    return {
        emptyPages: _.isEmpty(pages),
        selectedPage : _.find(pages,{id:selectedPageId}),
        pageId: selectedPageId,
        pageName: selectedPageName,
        contextParams: context,
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
        onSetDrilldownContext(drilldownContext){
            dispatch(setDrilldownContext(drilldownContext));
        },
        navigateTo404: () =>{
            dispatch(push('/404'));
        },
        navigateToError: (message) =>{
            dispatch(setAppError(message));
            dispatch(push('/error'));
        },
        navigateToMaintenancePage: () => {
            dispatch(push('/maintenance'));
        },
        onStorePageId: (pageId) => {
            dispatch(storeCurrentPageId(pageId));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
