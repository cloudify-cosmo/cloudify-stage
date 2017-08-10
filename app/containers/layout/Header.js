/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';
import {resetTemplate} from '../../actions/userApp';
import {setAppLoading, toogleSidebar} from '../../actions/app';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager || {},
        mode: state.config.mode,
        config: state.config,
        templates: state.templates,
        widgetDefinitions: state.widgetDefinitions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onResetTemplate: (manager,config,templates,widgetDefinitions) =>{
            dispatch(setAppLoading(true));
            dispatch(resetTemplate(manager,config,templates,widgetDefinitions));
            dispatch(setAppLoading(false));
        },
        onSidebarOpen(){
            dispatch(toogleSidebar());
        }
    }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, ownProps, dispatchProps, {
        onResetTemplate: ()=>dispatchProps.onResetTemplate(stateProps.manager,stateProps.config,stateProps.templates,stateProps.widgetDefinitions)
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Header);