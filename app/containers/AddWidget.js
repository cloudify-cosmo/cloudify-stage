/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import {addWidget, installWidget, uninstallWidget, updateWidget, checkIfWidgetIsUsed} from '../actions/widgets';
import AddWidgetModal from '../components/AddWidgetModal';
import Auth from '../utils/auth';

const mapStateToProps = (state, ownProps) => {

    var widgetDefinitions = state.widgetDefinitions.filter((definition) => {
        var widgetPermission = definition.permission;
        var authorizedRoles = state.manager.permissions[widgetPermission];
        // currently only one role per user is supported
        var userRoles = [state.manager.auth.role];

        return !Auth.isUserAuthorized(authorizedRoles, userRoles);
    });

    return {
        widgetDefinitions: widgetDefinitions,
        pageId: ownProps.pageId
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetAdded: (widgetDefinition) => {
            dispatch(addWidget(ownProps.pageId,widgetDefinition.name || 'Widget_'+(nameIndex++),widgetDefinition));
        },
        onWidgetInstalled : (widgetFile, widgetUrl)=> {
            return dispatch(installWidget(widgetFile, widgetUrl));
        },
        onWidgetUninstalled : (widgetId)=> {
            return dispatch(uninstallWidget(widgetId));
        },
        onWidgetUpdated : (widgetId, widgetFile, widgetUrl)=> {
            return dispatch(updateWidget(widgetId, widgetFile, widgetUrl));
        },
        onWidgetUsed : (widgetId)=> {
            return dispatch(checkIfWidgetIsUsed(widgetId));
        }
    }
};

const AddWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddWidgetModal);


export default AddWidget