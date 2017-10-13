/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import {addWidget, installWidget, uninstallWidget, updateWidget, checkIfWidgetIsUsed} from '../actions/widgets';
import {addPageWidget} from '../actions/templateManagement';
import AddWidgetModal from '../components/AddWidgetModal';
import Auth from '../utils/auth';

const mapStateToProps = (state, ownProps) => {

    var widgetDefinitions = state.widgetDefinitions.filter((definition) => {
        return Auth.isUserAuthorized(definition.permission, state.manager);
    });

    return {
        widgetDefinitions: widgetDefinitions,
        pageId: ownProps.pageId,
        pageManagementMode: ownProps.pageManagementMode
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetAdded: (widgetDefinition) => {
            if (ownProps.pageManagementMode) {
                dispatch(addPageWidget(ownProps.pageId,widgetDefinition.name || 'Widget_'+(nameIndex++),widgetDefinition));
            } else {
                dispatch(addWidget(ownProps.pageId,widgetDefinition.name || 'Widget_'+(nameIndex++),widgetDefinition));
            }
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