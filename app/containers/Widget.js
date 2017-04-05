/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Widget from '../components/Widget';
import {renameWidget,drillDownToPage,removeWidget,editWidget,maximizeWidget} from '../actions/widgets';
import {setValue} from '../actions/context';
import {fetchWidgetData} from '../actions/WidgetData';

const mapStateToProps = (state, ownProps) => {
    return {
        context: state.context,
        templates: state.templates.items || {},
        manager: state.manager || {},
        isEditMode: state.config.isEditMode,
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
            dispatch(removeWidget(pageId,widgetId));
        },
        onWidgetMaximize: (pageId,widgetId,maximized) => {
            dispatch(maximizeWidget(pageId,widgetId,maximized));
        },
        onWidgetConfigUpdate: (pageId, widgetId, configuration) => {
            dispatch(editWidget(pageId, widgetId, configuration));
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
