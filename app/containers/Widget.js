/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Widget from '../components/Widget';
import {renameWidget,removeWidget,editWidget,maximizeWidget} from '../actions/widgets';
import {removePageWidget, editPageWidget, maximizePageWidget} from '../actions/templateManagement';
import {setValue} from '../actions/context';
import {fetchWidgetData} from '../actions/WidgetData';

const mapStateToProps = (state, ownProps) => {
    return {
        context: state.context,
        templates: state.templates.items || {},
        manager: state.manager || {},
        isEditMode: ownProps.isEditMode,
        pageManagementMode: ownProps.pageManagementMode,
        widgetData: _.find(state.widgetData,{id:ownProps.widget.id}) || {}
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetNameChange: (pageId,widgetId,newName)=> {
            dispatch(renameWidget(pageId,widgetId,newName));
        },
        setContextValue: (key,value) => {
            dispatch(setValue(key,value));
        },
        onWidgetRemoved: (pageId,widgetId) => {
            if (ownProps.pageManagementMode) {
                dispatch(removePageWidget(widgetId));
            } else {
                dispatch(removeWidget(pageId, widgetId));
            }
        },
        onWidgetMaximize: (pageId,widgetId,maximized) => {
            if (ownProps.pageManagementMode) {
                dispatch(maximizePageWidget(pageId, widgetId, maximized));
            } else {
                dispatch(maximizeWidget(pageId, widgetId, maximized));
            }
        },
        onWidgetConfigUpdate: (pageId, widgetId, configuration) => {
            if (ownProps.pageManagementMode) {
                dispatch(editPageWidget(pageId, widgetId, configuration));
            } else {
                dispatch(editWidget(pageId, widgetId, configuration));
            }
        },
        fetchWidgetData: (widget,toolbox,paramsHandler) => {
            return dispatch(fetchWidgetData(widget,toolbox,paramsHandler));
        }
    }
};

const WidgetW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Widget);


export default WidgetW
