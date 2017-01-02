/**
 * Created by addihorowitz on 10/06/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import EditWidgetIcon from '../components/EditWidgetIcon';
import {editWidget} from '../actions/widgets';
import EditWidgetModal from '../components/EditWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.pageId,
        widget: ownProps.widget,
        configuration: ownProps.widget.configuration || {},
        configDef: ownProps.widget.plugin.initialConfiguration || []
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: (configuration) => {
            dispatch(editWidget(ownProps.pageId, ownProps.widget.id, configuration || ownProps.widget.configuration || {}));
        }
    }
};

let EditWidgetComponent = ({widget, onWidgetEdited,configDef,configuration}) => {
    return (
        <span>
            <EditWidgetIcon widgetId={widget.id} />
            <EditWidgetModal widget={widget} configDef={configDef} configuration={configuration} onWidgetEdited={onWidgetEdited} />
        </span>
    );
};

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget