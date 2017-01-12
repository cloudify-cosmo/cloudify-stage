/**
 * Created by addihorowitz on 10/06/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import EditWidgetIcon from '../components/EditWidgetIcon';
import {showWidgetConfig, editWidget} from '../actions/widgets';
import EditWidgetModal from '../components/EditWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.pageId,
        widget: ownProps.widget,
        configuration: ownProps.widget.configuration || {},
        configDef: ownProps.widget.plugin.initialConfiguration || [],
        showConfig: ownProps.widget.showConfig || false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onShowWidgetConfig: (showConfig) => {
            dispatch(showWidgetConfig(ownProps.pageId, ownProps.widget.id, showConfig));
        },
        onWidgetEdited: (configuration) => {
            dispatch(editWidget(ownProps.pageId, ownProps.widget.id, configuration || ownProps.widget.configuration || {}));
        }
    }
};

let EditWidgetComponent = ({widget, onWidgetEdited, onShowWidgetConfig, configDef, configuration, showConfig}) => {
    return (
        <span>
            <EditWidgetIcon widgetId={widget.id} onShowWidgetConfig={onShowWidgetConfig}/>
            <EditWidgetModal widget={widget} configDef={configDef} configuration={configuration} onWidgetEdited={onWidgetEdited} showConfig={showConfig} onShowWidgetConfig={onShowWidgetConfig}/>
        </span>
    );
};

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget