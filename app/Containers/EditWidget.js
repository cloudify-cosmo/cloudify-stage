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
        configuration: ownProps.widget.configuration
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: (configuration) => {
            dispatch(editWidget(ownProps.widget, configuration || ownProps.widget.configuration));
        }
    }
};

let EditWidgetComponent = ({widget,configuration, onWidgetEdited}) => {
    return (
        <div>
            <EditWidgetIcon widgetId={widget.id} />
            <EditWidgetModal widgetId={widget.id} configuration={configuration} onWidgetEdited={onWidgetEdited} />
        </div>
    );
};

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget