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
        configuration: ownProps.widget.configuration || {}
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: (configuration) => {
            dispatch(editWidget(ownProps.pageId, ownProps.widget.id, configuration || ownProps.widget.configuration || ownProps.widget.initialConfiguration));
        }
    }
};

let EditWidgetComponent = ({widget, onWidgetEdited}) => {
    return (
        <span>
            <EditWidgetIcon widgetId={widget.id} />
            <EditWidgetModal widget={widget} configuration={widget.configuration || widget.initialConfiguration || {}} onWidgetEdited={onWidgetEdited} />
        </span>
    );
};

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget