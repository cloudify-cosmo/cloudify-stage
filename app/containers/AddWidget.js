/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import AddWidgetButton from '../components/AddWidgetButton';
import {addWidget} from '../actions/widgets';
import AddWidgetModal from '../components/AddWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        widgetDefinitions: state.widgetDefinitions,
        pageId: ownProps.pageId
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetAdded: (widgetDefinition) => {
            dispatch(addWidget(ownProps.pageId,widgetDefinition.name || 'Widget_'+(nameIndex++),widgetDefinition));
        },
        onWidgetInstalled : ()=> {
            // dispatch

        }
    }
};

let AddWidgetComponent = ({widgetDefinitions,onWidgetAdded,onWidgetInstalled}) => {
    return (
        <div>
            <AddWidgetButton/>
            <AddWidgetModal widgetDefinitions={widgetDefinitions} onWidgetAdded={onWidgetAdded} onWidgetInstalled={onWidgetInstalled}/>
        </div>
    );
};

const AddWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddWidgetComponent);


export default AddWidget